import { z } from "zod";

// Esquemas de validación para los bloques de contenido del CMS.
// Cada tipo de PageBlock tiene su schema; `data` se valida contra el que
// corresponda por `type`. Centraliza el contrato entre el panel y el render.

const seo = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	ogImage: z.string().optional(),
});

export const blockSchemas = {
	hero: z.object({
		tag: z.string().optional(),
		title: z.string(),
		subtitle: z.string().optional(),
		cta: z.object({ label: z.string(), href: z.string() }).optional(),
		image: z.string().optional(),
	}),
	stats: z.object({
		title: z.string().optional(),
		items: z.array(
			z.object({
				label: z.string(),
				value: z.string(),
				unit: z.string().optional(),
				icon: z.string().optional(),
			}),
		),
	}),
	fareTable: z.object({
		title: z.string().optional(),
		categories: z.array(z.string()).optional(),
	}),
	paymentMethods: z.object({
		title: z.string().optional(),
		items: z.array(
			z.object({
				icon: z.string().optional(),
				name: z.string(),
				description: z.string().optional(),
			}),
		),
	}),
	rulesGrid: z.object({
		title: z.string().optional(),
		groups: z.array(
			z.object({
				title: z.string(),
				icon: z.string().optional(),
				items: z.array(
					z.object({
						text: z.string(),
						allowed: z.boolean().default(true),
						icon: z.string().optional(),
					}),
				),
			}),
		),
	}),
	faq: z.object({
		title: z.string().optional(),
		items: z.array(z.object({ question: z.string(), answer: z.string() })),
	}),
	map: z.object({
		title: z.string().optional(),
		center: z.tuple([z.number(), z.number()]).optional(),
		zoom: z.number().optional(),
	}),
	cta: z.object({
		title: z.string(),
		subtitle: z.string().optional(),
		button: z.object({ label: z.string(), href: z.string() }),
	}),
	richText: z.object({
		html: z.string(),
	}),
	media: z.object({
		src: z.string(),
		alt: z.string().optional(),
	}),
} as const;

export type PageBlockType = keyof typeof blockSchemas;

export const pageBlockSchema = z.object({
	id: z.number().optional(),
	pageId: z.string(),
	order: z.number().int().default(0),
	type: z.enum([
		"hero",
		"stats",
		"fareTable",
		"paymentMethods",
		"rulesGrid",
		"faq",
		"map",
		"cta",
		"richText",
		"media",
	]),
	data: z.unknown(),
});

export const pageSchema = z.object({
	slug: z
		.string()
		.min(1)
		.regex(/^[a-z0-9-]+$/, "solo minúsculas, números y guiones"),
	locale: z.enum(["ca", "es", "en"]),
	title: z.string().min(1),
	seo: seo.default({}),
	status: z.enum(["draft", "published"]).default("draft"),
	blocks: z.array(pageBlockSchema).optional(),
});

export type PageInput = z.infer<typeof pageSchema>;

/** Valida el `data` de un bloque según su `type`. Lanza si no cumple. */
export function validateBlockData(type: PageBlockType, data: unknown): unknown {
	const schema = blockSchemas[type];
	return schema.parse(data);
}
