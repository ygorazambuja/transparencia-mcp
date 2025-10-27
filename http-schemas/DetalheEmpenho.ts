import { z } from "zod";

export const DetalheEmpenhoSchema = z.object({
	NEMPG: z.string(),
	DATA: z.string(),
	VALOR: z.string(),
	TIPO: z.string(),
	FAVORECIDO: z.string().optional(),
	HISTORICO: z.string(),
	ORGAO: z.string(),
	UNIDADE: z.string(),
	FUNCAO: z.string(),
	SUBFUNCAO: z.string(),
	PROGRAMA: z.string(),
	ACAO: z.string(),
	ELEMENTO: z.string(),
	SUBELEMENTO: z.string(),
});

export type DetalheEmpenhoSchemaType = z.infer<typeof DetalheEmpenhoSchema>;
