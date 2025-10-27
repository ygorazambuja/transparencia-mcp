import { z } from "zod";

export const DespesasPagoPorNumeroSchema = z.array(
	z.object({
		EMPRESA: z.string(),
		NUMERO_PAGAMENTO: z.string(),
		DATA: z.string(),
		FAVORECIDO: z.string().optional(),
		HISTORICO: z.string(),
		VALOR: z.string(),
	}),
);

export type DespesasPagoPorNumeroSchemaType = z.infer<typeof DespesasPagoPorNumeroSchema>;
