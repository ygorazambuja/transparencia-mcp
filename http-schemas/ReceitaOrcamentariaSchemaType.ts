import { z } from "zod"

export const ReceitaOrcamentariaSchemaTypeSchema = z.array(
  z.object({
    ORDEM: z.string(),
    CODIGO: z.string(),
    EMPRESA: z.string(),
    EMPRESANOME: z.string(),
    VINCODIGO: z.string(),
    FONTESTN: z.string(),
    FONTE: z.string(),
    NOME: z.string(),
    PREVISAO_INICIAL: z.string(),
    PREVISAO_ATUALIZADA: z.string(),
    ARRECADADO_PERIODO: z.string(),
    ARRECADADO_TOTAL: z.string(),
  }),
);

export type ReceitaOrcamentariaSchemaTypeSchemaType = z.infer<typeof ReceitaOrcamentariaSchemaTypeSchema>;