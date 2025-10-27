import { z } from "zod";

export const NotasFiscaisLiquidacaoSchema = z.array(
	z.object({
		NUMERO_NOTA: z.string(),
		DATA_EMISSAO: z.string(),
		VALOR: z.string(),
		FORNECEDOR: z.string().optional(),
	}),
);

export type NotasFiscaisLiquidacaoSchemaType = z.infer<typeof NotasFiscaisLiquidacaoSchema>;
