import { z } from "zod";

export const DespesasGeraisSchema = z.array(
	z.object({
		EMPRESA: z.string(),
		NEMPG: z.string(),
		DATA: z.string(),
		HISTORICO: z.string(),
		FAVORECIDO: z.string(),
		VALOR: z.string(),
		TIPO: z.string(),
		CNPJ: z.string().optional(),
	}),
);

export type DespesasGeraisSchemaType = z.infer<typeof DespesasGeraisSchema>;
