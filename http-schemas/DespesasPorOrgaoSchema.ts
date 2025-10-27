import { z } from "zod"

export const DespesasPorOrgaoSchemaSchema = z.array(
  z.object({
    EMPRESA: z.string(),
    CODIGO: z.string(),
    DESCRICAO: z.string(),
    EMPENHADO: z.string(),
    LIQUIDADO: z.string(),
    PAGO: z.string(),
    DOTAC: z.string(),
    ALTDO: z.string(),
    DOTACAO_ATUALIZADA: z.string(),
  }),
);

export type DespesasPorOrgaoSchemaSchemaType = z.infer<typeof DespesasPorOrgaoSchemaSchema>;