import { z } from "zod";

export const OrdemPagtoParcelasSchema = z.array(
	z.object({
		PARCELA: z.string(),
		DATA_VENCIMENTO: z.string(),
		VALOR: z.string(),
		SITUACAO: z.string(),
	}),
);

export type OrdemPagtoParcelasSchemaType = z.infer<typeof OrdemPagtoParcelasSchema>;
