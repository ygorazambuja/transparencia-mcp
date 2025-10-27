import { z } from "zod";

export const DespesasPagoComOrdemSchema = z.array(
	z.object({
		EMPRESA: z.string(),
		NUMERO_ORDEM: z.string(),
		DATA: z.string(),
		VALOR: z.string(),
		TIPO: z.string(),
	}),
);

export type DespesasPagoComOrdemSchemaType = z.infer<typeof DespesasPagoComOrdemSchema>;
