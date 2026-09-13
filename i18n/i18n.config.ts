// vue-i18n config. El contenido real de Empresa Plana es texto plano con
// `@` (emails) y `{n}` literales (p.ej. "Delegación {n}"), que vue-i18n
// interpreta como sintaxis de "linked message" e interpolación. Un compiler
// passthrough devuelve el mensaje tal cual, evitando errores de parseo sin
// alterar los diccionarios.
export default defineI18nConfig(() => ({
	messageCompiler: (message: string) => () => message,
}));