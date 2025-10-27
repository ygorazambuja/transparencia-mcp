import { Katalist } from "katalist";
import z from "zod";
import type { ReceitaOrcamentariaSchemaTypeSchemaType } from "../../http-schemas/ReceitaOrcamentariaSchemaType";
import { BASE_URL } from "../shared/constants";

const kat = Katalist();

export const GetReceitaOrcamentariaSearchSchema = z.object({
	diaInicio: z
		.string()
		.describe(
			"Dia inicial do período (formato: '01' a '31'). Deve ser uma string de 2 dígitos. Exemplo: '01' para o primeiro dia do mês.",
		),
	mesInicio: z
		.string()
		.describe(
			"Mês inicial do período (formato: '01' a '12'). Deve ser uma string de 2 dígitos. Exemplo: '01' para janeiro, '12' para dezembro.",
		),
	diaFinal: z
		.string()
		.describe(
			"Dia final do período (formato: '01' a '31'). Deve ser uma string de 2 dígitos. Exemplo: '31' para o último dia do mês.",
		),
	mesFinal: z
		.string()
		.describe(
			"Mês final do período (formato: '01' a '12'). Deve ser uma string de 2 dígitos. Exemplo: '12' para dezembro.",
		),
	exercicio: z
		.string()
		.optional()
		.describe(
			"Ano fiscal (formato: '2023', '2024', etc.). Deve ser uma string de ano de 4 dígitos. Exemplo: '2023' para dados do ano de 2023. Se não informado, será usado o ano atual.",
		),
	empresa: z
		.string()
		.describe(
			"Código do setor/empresa (formato: '1', '2', etc.). Deve ser uma string sem zeros à esquerda representando a entidade/departamento governamental. Exemplo: '1' para a entidade principal. Use '1' como padrão se desconhecido.",
		),
	mostraDadosConsolidado: z
		.boolean()
		.describe(
			"Se deve mostrar dados consolidados em todas as entidades (true) ou dados apenas para uma entidade específica (false). Use false para dados detalhados, true para resumo agregado.",
		),
	codigoReceita: z
		.string()
		.optional()
		.describe(
			"Código da receita orçamentária (opcional). Permite filtrar por um código específico de receita, como '1611.01.0.3.00.00.00'.",
		),
	vinCodigo: z
		.string()
		.optional()
		.describe(
			"Código da vinculação (opcional). Código que identifica a vinculação da receita, como '000.000'.",
		),
	fonte: z
		.string()
		.optional()
		.describe(
			"Fonte de recursos (opcional). Código da fonte de recursos da receita, como '1.501.0000'.",
		),
	nomeReceita: z
		.string()
		.optional()
		.describe(
			"Nome/descrição da receita (opcional). Permite filtrar por parte do nome da receita, como termos relacionados a 'DÍVIDA ATIVA' ou 'SERV.ADM.'.",
		),
});

/**
 * Recupera dados de receita orçamentária do portal de transparência do governo brasileiro.
 *
 * Retorna um array de objetos contendo informações detalhadas sobre receitas orçamentárias,
 * incluindo códigos, valores previstos e arrecadados, fontes de recursos, etc.
 *
 * Cada objeto retornado contém:
 * - ORDEM: Ordem/sequência do registro
 * - CODIGO: Código da receita orçamentária
 * - EMPRESA: Código da empresa/entidade
 * - EMPRESANOME: Nome da empresa/entidade
 * - VINCODIGO: Código da vinculação
 * - FONTESTN: Fonte STN
 * - FONTE: Código da fonte de recursos
 * - NOME: Nome/descrição da receita
 * - PREVISAO_INICIAL: Valor previsto inicialmente
 * - PREVISAO_ATUALIZADA: Valor da previsão atualizada
 * - ARRECADADO_PERIODO: Valor arrecadado no período
 * - ARRECADADO_TOTAL: Valor total arrecadado
 */
export async function receitaOrcamentaria({
	diaInicio,
	mesInicio,
	diaFinal,
	mesFinal,
	exercicio,
	empresa,
	mostraDadosConsolidado,
	codigoReceita,
	vinCodigo,
	fonte,
	nomeReceita,
}: z.infer<typeof GetReceitaOrcamentariaSearchSchema>) {
	const currentYear = new Date().getFullYear().toString();
	const exercicioToUse = exercicio || currentYear;

	const defineExericioParams = new URLSearchParams();
	defineExericioParams.set("Listagem", "DefineExercicio");
	defineExericioParams.set("ConectarExercicio", exercicioToUse);

	const defineExercicio = await kat.get(
		`${BASE_URL}/Receitas/?${defineExericioParams.toString()}`,
	);

	const cookies = defineExercicio.headers.get("Set-Cookie");

	const receitaParams = new URLSearchParams();
	receitaParams.set("Listagem", "ReceitaOrcamentaria");
	receitaParams.set("DiaInicioPeriodo", diaInicio);
	receitaParams.set("MesInicialPeriodo", mesInicio);
	receitaParams.set("DiaFinalPeriodo", diaFinal);
	receitaParams.set("MesFinalPeriodo", mesFinal);
	receitaParams.set("Exercicio", exercicioToUse);
	receitaParams.set("Empresa", empresa);
	receitaParams.set(
		"MostraDadosConsolidado",
		mostraDadosConsolidado.toString(),
	);

	if (codigoReceita) {
		receitaParams.set("CodigoReceita", codigoReceita);
	}

	if (vinCodigo) {
		receitaParams.set("VinCodigo", vinCodigo);
	}

	if (fonte) {
		receitaParams.set("Fonte", fonte);
	}

	if (nomeReceita) {
		receitaParams.set("NomeReceita", nomeReceita);
	}

	const receita = await kat.get<ReceitaOrcamentariaSchemaTypeSchemaType>(
		`${BASE_URL}/Receitas/?${receitaParams.toString()}`,
		{
			headers: {
				Cookie: cookies ?? "",
			},
		},
	);

	return receita.json() ?? [];
}
