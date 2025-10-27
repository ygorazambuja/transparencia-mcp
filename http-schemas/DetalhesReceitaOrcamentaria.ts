import { z } from "zod";

export const DetalhesReceitaOrcamentariaSchema = z.array(
	z.object({
		DATA: z.string(),
		CODIGO: z.string(),
		DESCRICAO: z.string(),
		HISTORICO: z.string(),
		VALOR: z.string(),
	}),
);

export type DetalhesReceitaOrcamentariaSchemaType = z.infer<typeof DetalhesReceitaOrcamentariaSchema>;
