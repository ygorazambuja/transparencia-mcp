import { Katalist } from "katalist";
import z from "zod";
import type { DespesasPorUnidadeSchemaType } from "../../../http-schemas/DespesasPorUnidade";
import { BASE_URL } from "../../shared/constants";

const kat = Katalist();

export const GetDespesasPorUnidadeSearchSchema = z.object({
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
	codigo: z.string().optional().describe("Código da unidade."),
	descricao: z.string().optional().describe("Descrição da unidade."),
});

export async function despesasPorUnidade({
	diaInicio,
	mesInicio,
	diaFinal,
	mesFinal,
	exercicio,
	empresa,
	mostraDadosConsolidado,
	codigo,
	descricao,
}: z.infer<typeof GetDespesasPorUnidadeSearchSchema>) {
	const currentYear = new Date().getFullYear().toString();
	const exercicioToUse = exercicio || currentYear;

	const defineExericioParams = new URLSearchParams();
	defineExericioParams.set("Listagem", "DefineExercicio");
	defineExericioParams.set("Empresa", empresa);
	defineExericioParams.set("MostraDadosConsolidado", "true");
	defineExericioParams.set("ConectarExercicio", exercicioToUse);

	const defineExercicio = await kat.get(
		`${BASE_URL}/Despesas/?${defineExericioParams.toString()}`,
	);

	const cookies = defineExercicio.headers.get("Set-Cookie");

	const despesasPorUnidadeParams = new URLSearchParams();
	despesasPorUnidadeParams.set("Listagem", "DespesasPorUnidade");
	despesasPorUnidadeParams.set("DiaInicioPeriodo", diaInicio);
	despesasPorUnidadeParams.set("MesInicialPeriodo", mesInicio);
	despesasPorUnidadeParams.set("DiaFinalPeriodo", diaFinal);
	despesasPorUnidadeParams.set("MesFinalPeriodo", mesFinal);
	despesasPorUnidadeParams.set("Exercicio", exercicioToUse);
	despesasPorUnidadeParams.set("Empresa", empresa);
	despesasPorUnidadeParams.set(
		"MostraDadosConsolidado",
		mostraDadosConsolidado.toString(),
	);

	const despesasPorUnidade = await kat.get<DespesasPorUnidadeSchemaType>(
		`${BASE_URL}/Despesas/?${despesasPorUnidadeParams.toString()}`,
		{
			headers: {
				Cookie: cookies ?? "",
			},
		},
	);

	const despesasPorUnidadeData = (await despesasPorUnidade.json()) ?? [];

	return despesasPorUnidadeData.filter((despesa) => {
		if (codigo && despesa.CODIGO) {
			if (!despesa.CODIGO.toLowerCase().includes(codigo.toLowerCase())) {
				return false;
			}
		}

		if (descricao && despesa.DESCRICAO) {
			if (!despesa.DESCRICAO.toLowerCase().includes(descricao.toLowerCase())) {
				return false;
			}
		}

		return true;
	});
}
