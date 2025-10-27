import { z } from "zod";

export const ReceitaUniaoSchema = z.array(
	z.object({
		CODIGO: z.string(),
		DESCRICAO: z.string(),
		PREVISTO: z.string(),
		ARRECADADO: z.string(),
		DIFERENCA: z.string(),
		PERCENTUAL: z.string(),
	}),
);

export type ReceitaUniaoSchemaType = z.infer<typeof ReceitaUniaoSchema>;
