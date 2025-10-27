import { z } from "zod";

export const ReceitaExtraOrcamentariaSchema = z.array(
	z.object({
		CODIGO: z.string(),
		DESCRICAO: z.string(),
		ARRECADADO: z.string(),
	}),
);

export type ReceitaExtraOrcamentariaSchemaType = z.infer<typeof ReceitaExtraOrcamentariaSchema>;
