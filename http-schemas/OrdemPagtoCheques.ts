import { z } from "zod";

export const OrdemPagtoChequesSchema = z.array(
	z.object({
		NUMERO_CHEQUE: z.string(),
		BANCO: z.string(),
		AGENCIA: z.string(),
		CONTA: z.string(),
		DATA_EMISSAO: z.string(),
		VALOR: z.string(),
	}),
);

export type OrdemPagtoChequesSchemaType = z.infer<typeof OrdemPagtoChequesSchema>;
