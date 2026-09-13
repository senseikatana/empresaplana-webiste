# Tap to Pay a bordo — Propuesta de pago EMV contactless

> **Estado:** Propuesta interna · Borrador
> **Rama:** `feat/tap-to-pay-proposal` — **no va a producción**
> **Fecha:** septiembre 2026

## 1. Resumen ejecutivo

Hoy el billete sencillo se paga **en efectivo dentro del autobús**. Esta propuesta
documenta cómo incorporar **Tap to Pay** (pago con tarjeta bancaria contactless,
móvil o smartwatch directamente en un validador a bordo) cuando la empresa decida
admitir el pago con tarjeta.

El sector ya lo ha normalizado: la Comunidad de Madrid (CRTM) lo extendió a toda
su red de autobuses interurbanos en julio de 2025, EMT Madrid ya lo tiene
implantado, AUVASA acepta "Tarjeta Bancaria (EMV)" y Alsa trabaja con Mastercard
en EMV-contactless. La tecnología es madura; la decisión es de negocio, no de riesgo
tecnológico.

**Conclusión principal:** la viabilidad técnica depende menos del hardware que de la
**estructura tarifaria**. Madrid lo resolvió simplificando 21 precios a 2 tarifas
planas (1,50 € urbano / 3,00 € interurbano). Esa decisión tarifaria es el
verdadero punto de partida.

## 2. Contexto y motivación

### Situación actual

- Pago en efectivo al conductor. Sin registro digital del viaje asociado al pago.
- El efectivo a bordo implica: manipulado por el conductor, riesgo de descuadres,
  lentitud en parada (tiempo de cobro = tiempo de servicio) y barrera para el
  viajero ocasional/turista que no lleva suelto.

### Qué está haciendo el sector

| Operador | Situación |
|---|---|
| CRTM (Madrid) | EMV en toda la red interurbana desde jul-2025 (validadores GMV TV100, ~70 % de la flota). Piloto previo en dic-2024. |
| EMT Madrid | Ya implantado. |
| AUVASA (Valladolid) | Acepta tarjeta bancaria EMV, tarjeta propia y app con QR. |
| Alsa | Acuerdo con Mastercard para EMV-contactless y validación desde app. |
| TAP (Los Ángeles) | Tarjeta bancaria + tarjeta propia + wallets, con *fare capping*. |

### Beneficios esperados

- **Rapidez de subida:** el tap tarda < 1 s; el cobro en efectivo, decenas de
  segundos. Impacto directo en puntualidad.
- **Accesibilidad al turista** (crítico en Costa Daurada): pagar como en casa, con
  su tarjeta o móvil, sin cambiar divisa ni buscar efectivo.
- **Menos efectivo a bordo:** seguridad del conductor y menos gestión de caja.
- **Datos reales de demanda** por parada y franja, hoy inexistentes para el billete
  sencillo.

## 3. Qué es Tap to Pay / cEMV

Pago con **tarjeta EMV contactless** (chip NFC) presentada a un validador. Acepta:

- Tarjetas físicas contactless (Visa, Mastercard…).
- Tarjetas virtualizadas en móvil/reloj (Apple Pay, Google Pay, Samsung Wallet).

### Niveles de certificación EMV (los exige la marca y el adquirente)

| Nivel | Qué certifica | Quién lo hace |
|---|---|---|
| **L1** | Hardware y radio contactless del validador | Laboratorio acreditado (lo aporta el fabricante) |
| **L2** | Kernel EMV (lógica de la transacción en el dispositivo) | Fabricante del validador / kernel |
| **L3** | Integración extremo a extremo con cada marca (Visa, Mastercard) y el adquirente | Proyecto + adquirente (es la que hay que presupuestar) |

Comprar validadores con L1+L2 ya certificados (p. ej. GMV TV100 u otros) reduce el
proyecto a la certificación L3 + integración.

## 4. El punto crítico: modelo tarifario

El importe del billete sencillo hoy depende del trayecto. El sistema cEMV tiene
tres modelos, y la elección manda sobre todo lo demás:

### Modelo 1 — Tarifa conocida (*flat fare*)
El validador cobra un importe fijo conocido al instante (autorización inmediata o
diferida). **Requisito: tarifa plana o muy simple.**
Ejemplo: Madrid, que simplificó 21 precios a 2 (1,50 € / 3,00 €) el mismo día que
activó EMV. No es casualidad: es la condición.

### Modelo 2 — Agregación
El viajero hace tap al subir (y opcionalmente al bajar); el sistema **acumula los
taps del día y cobra un único cargo agregado** al final de la jornada, aplicando
la tarifa real por trayectos y posibles topes (*fare capping*). Permite tarifas
por distancia sin simplificar, a cambio de más complejidad de back-office
(first-ride risk, listas de denegación).

### Modelo 3 — Account-Based Ticketing (ABT)
La tarjeta es solo un identificador de una cuenta en la nube donde vive el saldo,
los abonos y las reglas. Es el modelo destino al que evolucionan los grandes
sistemas (el propio CRTM prepara su ABT). Máxima flexibilidad, máxima inversión.

### Recomendación para Empresa Plana

1. **Corto plazo (piloto): Modelo 1.** Definir 1–2 tarifas planas para el billete
   sencillo en las líneas del piloto. Es la decisión de negocio a tomar antes de
   hablar con proveedores.
2. **Horizonte: preparar la migración a Modelo 2/3** eligiendo proveedores que ya
   soporten ABT (como hace GMV con CRTM), para no cambiar de hardware después.

> Nota: convivirá siempre con el efectivo. En Madrid el billete sencillo en
> efectivo es el 3,3 % de los viajeros, pero se mantiene como opción.

## 5. Arquitectura propuesta

```
[Viajero: tarjeta / móvil / reloj]
        │ tap (NFC)
        ▼
┌─────────────────────┐      4G (store & forward si no hay cobertura)
│ Validador a bordo   │ ─────────────────────────────┐
│ EMV L1+L2 · PCI PTS │                              │
│ GPS · impresora op. │                              ▼
└─────────────────────┘                  ┌────────────────────────┐
                                         │ Pasarela / adquirente  │
                                         │ (autorización y cobro) │
                                         └───────────┬────────────┘
                                                     │
        ┌────────────────────────────────────────────▼───────────┐
        │ Back-office de billetaje                                │
        │ · Motor tarifario y agregación (modelo 2)               │
        │ · Liquidación y conciliación                            │
        │ · DEN list (tarjetas denegadas) → se distribuye a buses │
        │ · First-ride risk y recuperación de deuda               │
        │ · App de inspección (lee el mismo token de la tarjeta)  │
        └─────────────────────────────────────────────────────────┘
                                                     │ export
                                                     ▼
                                    (opcional) reporting hacia nuestro
                                    stack Nuxt/Nitro/Postgres
```

- **Validador:** hardware con EMV L1+L2 y PCI PTS (seguridad de dispositivo no
  atendido), 4G, GPS. Compra o renting con mantenimiento.
- **Conectividad:** 4G con almacenamiento local y envío diferido
  (*store & forward*): la validación no puede depender de la cobertura en ruta.
- **DEN list:** lista de tarjetas con pagos rechazados, distribuida a la flota
  varias veces al día; el validador rechaza el tap en caliente.
- **First-ride risk:** el primer tap se acepta antes de cobrar (la autorización
  real llega después). Se asume un pequeño riesgo de impago a cambio de subidas
  instantáneas; se mitiga con DEN list y reintentos de cobro.
- **Inspección:** el inspector lee con su dispositivo el mismo identificador
  tokenizado de la tarjeta; no hace falta billete físico ni app del viajero.
- **Integración con nuestro stack:** el back-office del proveedor exporta
  liquidaciones y datos de demanda (CSV/API) que podemos explotar en Postgres y
  mostrar en el dashboard. No se construye billetaje propio.

## 6. Cumplimiento normativo

- **PCI DSS** en el back-office que procesa pagos (lo asume el proveedor/adquirente;
  hay que exigirlo en contrato).
- **PCI PTS** en los validadores.
- **EMV L3** con cada marca, coordinado por el adquirente (partida del proyecto).
- **PSD2 / SCA:** en transporte se opera con **autorización diferida** y las
  exenciones de transporte; el viajero no introduce PIN a bordo.
- **RGPD:** el PAN nunca se almacena en claro; se trabaja con el token EMV.
  Minimización de datos y base jurídica clara para los datos de demanda.

## 7. Alternativas y complementos

No son excluyentes; AUVASA combina los tres:

| Canal | Qué aporta | Coste relativo |
|---|---|---|
| **EMV a bordo** (esta propuesta) | Universal: cualquier tarjeta o móvil, sin app ni registro | Alto (hardware + certificación) |
| **QR en app propia** (modelo AUVASA PAY) | Recargas, bonos, fidelización | Medio (desarrollo app) |
| **T-Mobilitat / tarjeta NFC propia** | Integración con la red interurbana catalana (ATM Camp de Tarragona), abonos subvencionados | Depende de convenio con la ATM |
| Efectivo | Se mantiene siempre | — |

La interoperabilidad con **T-Mobilitat** merece análisis aparte: buena parte del
viajero recurrente de la Costa Daurada ya la usa o la usará; Tap to Pay resuelve
sobre todo al viajero ocasional y al turista.

## 8. Plan por fases

| Fase | Contenido | Criterio de salida |
|---|---|---|
| **0. Estudio** | Decisión tarifaria (¿tarifa plana piloto?), RFP a 2–3 proveedores (p. ej. GMV y alternativas), convenio adquirente | Tarifas aprobadas + oferta elegida |
| **1. Piloto** | 1 línea, 3–5 validadores, certificación L3, formación de conductores e inspectores | 3 meses con KPIs en verde |
| **2. Despliegue** | Resto de flota por lotes, DEN list operativa, comunicación al viajero | 100 % flota, efectivo < umbral |
| **3. Evolución** | Agregación/tope diario (Modelo 2) o salto a ABT; acercamiento a T-Mobilitat | Decisión con ATM/proveedor |

## 9. Costes orientativos

> **Estimación a validar con ofertas reales (fase 0).** Rangos de mercado
> habituales, no presupuesto.

| Partida | Rango orientativo | Tipo |
|---|---|---|
| Validador (EMV L1+L2, PCI PTS, 4G) | 1.500 – 3.000 €/ud | CAPEX o renting |
| Certificación EMV L3 + proyecto de integración | Partida única (decenas de miles €) | CAPEX |
| Back-office de billetaje | SaaS: cuota mensual + fee/transacción | OPEX |
| Adquirente (pasarela y cobro) | % por transacción — **micropagos: negociar tarifa plana por operación** | OPEX |
| Conectividad 4G flota | Cuota mensual por bus | OPEX |
| Formación, señalización, comunicación | Partida menor | CAPEX |

Atención a las comisiones en billetes de importe bajo: un % fijo por transacción
puede comerse el margen de un billete sencillo. Es un punto de negociación clave
con el adquirente.

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Estructura tarifaria actual incompatible con Modelo 1 | Decisión tarifaria en fase 0; si no, Modelo 2 con proveedor que lo soporte |
| Impagos (first-ride risk) | DEN list distribuida a flota, reintentos de cobro, límites por tarjeta |
| Cobertura 4G en ruta | Store & forward en el validador; autorización diferida |
| Contracargos (chargebacks) | Registro probatorio del tap (GPS, hora, bus); política de no disputar importes menores |
| Fees de micropago | Negociar tarifa plana/adquirente especializado en transporte |
| Adopción baja | Comunicación en paradas y a bordo; mantener efectivo; campaña turística |
| Dependencia de un único proveedor | Exigir estándares abiertos y exportación de datos en contrato |

## 11. KPIs del piloto

- % de billetes sencillos pagados con tarjeta (objetivo: > 25 % a los 3 meses).
- Tiempo medio de subida por viajero (antes/después).
- Tasa de impago tras reintentos (< 1 %).
- Disponibilidad del validador (> 99 %).
- Satisfacción del conductor (encuesta).

## 12. Próximos pasos

1. Validar esta propuesta con dirección y con explotación (conductores/inspección).
2. Abrir el debate tarifario: ¿qué líneas admiten tarifa plana de piloto?
3. RFP a 2–3 proveedores de billetaje EMV (incluir requisito de evolución a ABT).
4. Contactar con la ATM Camp de Tarragona para sondear interoperabilidad T-Mobilitat.
5. Estimar inversión real y punto de equilibrio frente a gestión del efectivo.

## 13. Referencias

- CRTM — *La Comunidad de Madrid extiende el pago con tarjeta bancaria a la red de
  autobuses interurbanos* (27/06/2025).
- GMV — *EMV payment system in the Community of Madrid* (validador TV100, jul-2025).
- Mastercard Newsroom — acuerdo Alsa + Mastercard (EMV-contactless).
- Web de AUVASA — medios de pago (efectivo, EMV, tarjeta transporte, app QR).
- TAP (LA Metro) — fare capping y pago con tarjeta bancaria.

---

*Documento interno de exploración. Cifras de terceros extraídas de fuentes
públicas; los costes son rangos orientativos pendientes de RFP.*
