import { z } from "zod";

export const DespesasPorExigibilidadeSchema = z.array(
	z.object({
		EMPRESA: z.string(),
		NEMPG: z.string(),
		DATA: z.string(),
		FAVORECIDO: z.string().optional(),
		HISTORICO: z.string(),
		VALOR: z.string(),
		DATA_VENCIMENTO: z.string(),
		DIAS_VENCIMENTO: z.string(),
		TIPO: z.string(),
	}),
);

export type DespesasPorExigibilidadeSchemaType = z.infer<typeof DespesasPorExigibilidadeSchema>;
