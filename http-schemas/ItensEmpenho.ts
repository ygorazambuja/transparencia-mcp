import { z } from "zod";

export const ItensEmpenhoSchema = z.array(
	z.object({
		ITEM: z.string(),
		DESCRICAO: z.string(),
		UNIDADE: z.string(),
		QUANTIDADE: z.string(),
		VALOR_UNITARIO: z.string(),
		VALOR_TOTAL: z.string(),
	}),
);

export type ItensEmpenhoSchemaType = z.infer<typeof ItensEmpenhoSchema>;
