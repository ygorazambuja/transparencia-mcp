import { z } from "zod";

export const OrdemPagtoDetalhesSchema = z.object({
	EMPRESA: z.string(),
	NUMERO_ORDEM: z.string(),
	DATA: z.string(),
	FAVORECIDO: z.string().optional(),
	VALOR: z.string(),
	HISTORICO: z.string(),
	FORMA_PAGAMENTO: z.string(),
});

export type OrdemPagtoDetalhesSchemaType = z.infer<typeof OrdemPagtoDetalhesSchema>;
