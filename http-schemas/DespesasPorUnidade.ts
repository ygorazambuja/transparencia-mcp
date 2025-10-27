import { z } from "zod";

export const DespesasPorUnidadeSchema = z.array(
	z.object({
		EMPRESA: z.string(),
		CODIGO: z.string(),
		DESCRICAO: z.string(),
		EMPENHADO: z.string(),
		LIQUIDADO: z.string(),
		PAGO: z.string(),
		DOTAC: z.string(),
		ALTDO: z.string(),
		DOTACAO_ATUALIZADA: z.string(),
	}),
);

export type DespesasPorUnidadeSchemaType = z.infer<typeof DespesasPorUnidadeSchema>;
