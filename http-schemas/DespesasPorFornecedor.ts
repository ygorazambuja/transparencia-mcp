import { z } from "zod";

export const DespesasPorFornecedorSchema = z.array(
	z.object({
		EMPRESA: z.string(),
		CNPJ: z.string(),
		FORNECEDOR: z.string(),
		EMPENHADO: z.string(),
		LIQUIDADO: z.string(),
		PAGO: z.string(),
	}),
);

export type DespesasPorFornecedorSchemaType = z.infer<typeof DespesasPorFornecedorSchema>;
