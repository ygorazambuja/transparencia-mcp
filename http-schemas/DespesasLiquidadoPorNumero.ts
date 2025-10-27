import { z } from "zod";

export const DespesasLiquidadoPorNumeroSchema = z.array(
	z.object({
		EMPRESA: z.string(),
		NUMERO_LIQUIDACAO: z.string(),
		DATA: z.string(),
		FAVORECIDO: z.string().optional(),
		HISTORICO: z.string(),
		VALOR: z.string(),
	}),
);

export type DespesasLiquidadoPorNumeroSchemaType = z.infer<typeof DespesasLiquidadoPorNumeroSchema>;
