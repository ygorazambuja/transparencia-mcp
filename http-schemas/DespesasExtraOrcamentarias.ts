import { z } from "zod";

export const DespesasExtraOrcamentariasSchema = z.array(
	z.object({
		EMPRESA: z.string(),
		NEMPG: z.string(),
		DATA: z.string(),
		FAVORECIDO: z.string().optional(),
		HISTORICO: z.string(),
		VALOR: z.string(),
		TIPO: z.string(),
		CNPJ: z.string().optional(),
	}),
);

export type DespesasExtraOrcamentariasSchemaType = z.infer<typeof DespesasExtraOrcamentariasSchema>;
