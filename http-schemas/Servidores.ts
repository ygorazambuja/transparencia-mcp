import { z } from "zod";

export const ServidoresSchema = z.array(
	z.object({
		EMPRESA: z.string().optional(),
		REGISTRO: z.string().optional(),
		REFERENCIA: z.string().optional(),
		REFERENCIA_NOME: z.string().optional(),
		ID: z.string().optional(),
		CONTRATO: z.string().optional(),
		NOME: z.string().optional(),
		NOME_SOCIAL: z.string().optional(),
		DIVISAO: z.string().optional(),
		SUBDIVISAO: z.string().optional(),
		UNIDADE: z.string().optional(),
		CARGO: z.string().optional(),
		VINCULO: z.string().optional(),
		CATEGORIAFUNCIONAL: z.string().optional(),
		DATAADMISSAO: z.string().optional(),
		DATADESLIGAMENTO: z.string().optional(),
		REFSALATUAL: z.string().optional(),
		ATOADMISSAO: z.string().optional(),
		ATODEMISSAO: z.string().optional(),
		DATAADMISSAOCOMISSAO: z.string().optional(),
		ATOADMISSAOCOMISSAO: z.string().optional(),
		PROVENTOS: z.string().optional(),
		DESCONTOS: z.string().optional(),
		NATUREZA: z.string().optional(),
		FORMAPROVIMENTO: z.string().optional(),
		NUMDOCCRIACAOCARGO: z.string().optional(),
		TIPOREGIME: z.string().optional(),
		SITUACAOFUNCIONAL: z.string().optional(),
		HORASEMANAL: z.string().optional(),
		TIPOCONTRATO: z.string().optional(),
		DTTERMINO: z.string().optional(),
		CPF: z.string().optional(),
		CPFFORMATADO: z.string().optional(),
		CARGOINICIO: z.string().optional(),
		ATIVIDADE: z.string().optional(),
		NOMEATIVIDADE: z.string().optional(),
		LOCALDETRABALHO: z.string().optional(),
		"LIQUIDO + (IsNull(PROVENTOS, 0)-IsNull(DESCONTOS,0))": z
			.string()
			.optional(),
		// Legacy fields for backward compatibility
		MATRICULA: z.string().optional(),
		SALARIO: z.string().optional(),
		DATA_ADMISSAO: z.string().optional(),
		STATUS: z.string().optional(),
	}),
);

export type ServidoresSchemaType = z.infer<typeof ServidoresSchema>;
