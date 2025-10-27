import { z } from "zod";

export const DespesasRestosPagarSchema = z.array(
	z.object({
		EMPRESA: z.string(),
		NEMPG: z.string(),
		DATA: z.string(),
		VALOR: z.string(),
		FAVORECIDO: z.string().optional(),
		HISTORICO: z.string(),
		TIPO_RESTO: z.string(),
		EXERCICIO_ORIGEM: z.string(),
	}),
);

export type DespesasRestosPagarSchemaType = z.infer<typeof DespesasRestosPagarSchema>;
