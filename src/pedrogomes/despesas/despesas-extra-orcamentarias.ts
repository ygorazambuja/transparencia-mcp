import { Katalist } from "katalist";
import z from "zod";
import type { DespesasExtraOrcamentariasSchemaType } from "../../../http-schemas/DespesasExtraOrcamentarias";
import { BASE_URL } from "../../shared/constants";

const kat = Katalist();

export const GetDespesasExtraOrcamentariasSearchSchema = z.object({
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
	mostrarFornecedor: z
		.boolean()
		.describe(
			"Se deve mostrar o nome do fornecedor/favorecido nos resultados (true) ou não (false).",
		),
	mostrarCnpjFornecedor: z
		.boolean()
		.describe(
			"Se deve mostrar o CNPJ do fornecedor nos resultados (true) ou não (false).",
		),
	favorecido: z
		.string()
		.optional()
		.describe("Nome do favorecido para filtrar."),
	historico: z
		.string()
		.optional()
		.describe("Histórico/descrição para filtrar."),
	tipo: z.string().optional().describe("Tipo de despesa para filtrar."),
});

export async function despesasExtraOrcamentarias({
	diaInicio,
	mesInicio,
	diaFinal,
	mesFinal,
	exercicio,
	empresa,
	mostraDadosConsolidado,
	mostrarFornecedor,
	mostrarCnpjFornecedor,
	favorecido,
	historico,
	tipo,
}: z.infer<typeof GetDespesasExtraOrcamentariasSearchSchema>) {
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

	const despesasExtraOrcamentariasParams = new URLSearchParams();
	despesasExtraOrcamentariasParams.set(
		"Listagem",
		"DespesasExtraOrcamentarias",
	);
	despesasExtraOrcamentariasParams.set("DiaInicioPeriodo", diaInicio);
	despesasExtraOrcamentariasParams.set("MesInicialPeriodo", mesInicio);
	despesasExtraOrcamentariasParams.set("DiaFinalPeriodo", diaFinal);
	despesasExtraOrcamentariasParams.set("MesFinalPeriodo", mesFinal);
	despesasExtraOrcamentariasParams.set("Exercicio", exercicioToUse);
	despesasExtraOrcamentariasParams.set("Empresa", empresa);
	despesasExtraOrcamentariasParams.set(
		"MostraDadosConsolidado",
		mostraDadosConsolidado.toString(),
	);
	despesasExtraOrcamentariasParams.set(
		"MostrarFornecedor",
		mostrarFornecedor.toString(),
	);
	despesasExtraOrcamentariasParams.set(
		"MostrarCNPJFornecedor",
		mostrarCnpjFornecedor.toString(),
	);

	const despesasExtraOrcamentarias =
		await kat.get<DespesasExtraOrcamentariasSchemaType>(
			`${BASE_URL}/Despesas/?${despesasExtraOrcamentariasParams.toString()}`,
			{
				headers: {
					Cookie: cookies ?? "",
				},
			},
		);

	const despesasExtraOrcamentariasData =
		(await despesasExtraOrcamentarias.json()) ?? [];

	return despesasExtraOrcamentariasData.filter((despesa) => {
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

		if (tipo && despesa.TIPO) {
			if (!despesa.TIPO.toLowerCase().includes(tipo.toLowerCase())) {
				return false;
			}
		}

		return true;
	});
}
