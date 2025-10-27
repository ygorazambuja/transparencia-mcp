import { Katalist } from "katalist";
import z from "zod";
import type { DespesasEmpenhadoPorNumeroSchemaType } from "../../../http-schemas/DespesasEmpenhadoPorNumero";
import { BASE_URL } from "../../shared/constants";

const kat = Katalist();

export const GetDespesasEmpenhadoPorNumeroSearchSchema = z.object({
	numeroEmpenho: z
		.string()
		.describe("Número do empenho a ser consultado. Exemplo: '1', '123', etc."),
	tipoEmpenho: z
		.string()
		.describe(
			"Tipo do empenho. Valores comuns: 'OR' (ordinário), 'ES' (estimativo), 'GL' (global). Exemplo: 'OR'.",
		),
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
	idButton: z
		.string()
		.describe(
			"Tipo de listagem. Geralmente 'lnkDespesasPor_NotaEmpenho' para listagem por nota de empenho.",
		),
	mostrarFornecedor: z
		.boolean()
		.describe(
			"Se deve mostrar o nome do fornecedor/favorecido nos resultados (true) ou não (false).",
		),
	mostraDadosConsolidado: z
		.boolean()
		.describe(
			"Se deve mostrar dados consolidados em todas as entidades (true) ou dados apenas para uma entidade específica (false). Use false para dados detalhados, true para resumo agregado.",
		),
	favorecido: z
		.string()
		.optional()
		.describe("Nome do favorecido para filtrar."),
	historico: z
		.string()
		.optional()
		.describe("Histórico/descrição para filtrar."),
});

export async function despesasEmpenhadoPorNumero({
	numeroEmpenho,
	tipoEmpenho,
	diaInicio,
	mesInicio,
	diaFinal,
	mesFinal,
	exercicio,
	empresa,
	idButton,
	mostrarFornecedor,
	mostraDadosConsolidado,
	favorecido,
	historico,
}: z.infer<typeof GetDespesasEmpenhadoPorNumeroSearchSchema>) {
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

	const despesasEmpenhadoParams = new URLSearchParams();
	despesasEmpenhadoParams.set(
		"Listagem",
		"EmpenhosDespesas_Empenhado_PorNumeroEmpenho",
	);
	despesasEmpenhadoParams.set("intNumeroEmpenho", numeroEmpenho);
	despesasEmpenhadoParams.set("strTipoEmpenho", tipoEmpenho);
	despesasEmpenhadoParams.set("DiaInicioPeriodo", diaInicio);
	despesasEmpenhadoParams.set("MesInicialPeriodo", mesInicio);
	despesasEmpenhadoParams.set("DiaFinalPeriodo", diaFinal);
	despesasEmpenhadoParams.set("MesFinalPeriodo", mesFinal);
	despesasEmpenhadoParams.set("Exercicio", exercicioToUse);
	despesasEmpenhadoParams.set("Empresa", empresa);
	despesasEmpenhadoParams.set("IDButton", idButton);
	despesasEmpenhadoParams.set(
		"MostrarFornecedor",
		mostrarFornecedor.toString(),
	);
	despesasEmpenhadoParams.set(
		"MostraDadosConsolidado",
		mostraDadosConsolidado.toString(),
	);

	const despesasEmpenhado = await kat.get<DespesasEmpenhadoPorNumeroSchemaType>(
		`${BASE_URL}/Despesas/?${despesasEmpenhadoParams.toString()}`,
		{
			headers: {
				Cookie: cookies ?? "",
			},
		},
	);

	const despesasEmpenhadoData = (await despesasEmpenhado.json()) ?? [];

	return despesasEmpenhadoData.filter((despesa) => {
		if (favorecido && despesa.FAVORECIDO) {
			if (
				!despesa.FAVORECIDO.toLowerCase().includes(favorecido.toLowerCase())
			) {
				return false;
			}
		}

		if (historico && despesa.HISTORICO) {
			if (!despesa.HISTORICO.toLowerCase().includes(historico.toLowerCase())) {
				return false;
			}
		}

		return true;
	});
}
