import { z } from "zod";

export const DespesasEmpenhadoPorNumeroSchema = z.array(
	z.object({
		EMPRESA: z.string(),
		NEMPG: z.string(),
		DATA: z.string(),
		FAVORECIDO: z.string().optional(),
		HISTORICO: z.string(),
		VALOR: z.string(),
		TIPO: z.string(),
	}),
);

export type DespesasEmpenhadoPorNumeroSchemaType = z.infer<typeof DespesasEmpenhadoPorNumeroSchema>;
