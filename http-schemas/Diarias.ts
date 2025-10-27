import { z } from "zod";

export const DiariasSchema = z.array(
	z.object({
		NEMPG: z.string(),
		DATA: z.string(),
		CODIF: z.string(),
		FAVORECIDO: z.string(),
		CARGO: z.string(),
		VALOR: z.string(),
		DEVOLUCAO: z.string(),
		VALORGASTO: z.string(),
		DESCRICAO: z.string(),
		PKEMP: z.string(),
		NOME_ELEMENTO: z.string(),
		ORGAO: z.string(),
		CODUNIDADE: z.string(),
		NOMEUNIDADE: z.string(),
		UNIDADE: z.string(),
		CPFFORMATADO: z.string(),
	}),
);

export type DiariasSchemaType = z.infer<typeof DiariasSchema>;
