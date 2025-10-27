import { Katalist } from "katalist";
import z from "zod";
import type { DespesasPorFornecedorSchemaType } from "../../../http-schemas/DespesasPorFornecedor";
import { BASE_URL } from "../../shared/constants";

const kat = Katalist();

export const GetDespesasPorFornecedorSearchSchema = z.object({
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
	cnpjFornecedor: z
		.string()
		.optional()
		.describe(
			"CNPJ de um fornecedor específico para filtrar os resultados (opcional). Exemplo: '12.345.678/0001-90'.",
		),
	fornecedor: z
		.string()
		.optional()
		.describe("Nome do fornecedor para filtrar os resultados."),
});

export async function despesasPorFornecedor({
	diaInicio,
	mesInicio,
	diaFinal,
	mesFinal,
	exercicio,
	empresa,
	mostraDadosConsolidado,
	mostrarFornecedor,
	cnpjFornecedor,
	fornecedor,
}: z.infer<typeof GetDespesasPorFornecedorSearchSchema>) {
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

	const despesasPorFornecedorParams = new URLSearchParams();
	despesasPorFornecedorParams.set("Listagem", "DespesasPorFornecedor");
	despesasPorFornecedorParams.set("DiaInicioPeriodo", diaInicio);
	despesasPorFornecedorParams.set("MesInicialPeriodo", mesInicio);
	despesasPorFornecedorParams.set("DiaFinalPeriodo", diaFinal);
	despesasPorFornecedorParams.set("MesFinalPeriodo", mesFinal);
	despesasPorFornecedorParams.set("Exercicio", exercicioToUse);
	despesasPorFornecedorParams.set("Empresa", empresa);
	despesasPorFornecedorParams.set(
		"MostraDadosConsolidado",
		mostraDadosConsolidado.toString(),
	);
	despesasPorFornecedorParams.set(
		"MostrarFornecedor",
		mostrarFornecedor.toString(),
	);
	if (cnpjFornecedor) {
		despesasPorFornecedorParams.set("CNPJFornecedor", cnpjFornecedor);
	}

	const despesasPorFornecedor = await kat.get<DespesasPorFornecedorSchemaType>(
		`${BASE_URL}/Despesas/?${despesasPorFornecedorParams.toString()}`,
		{
			headers: {
				Cookie: cookies ?? "",
			},
		},
	);

	const despesasPorFornecedorData = (await despesasPorFornecedor.json()) ?? [];

	return despesasPorFornecedorData.filter((despesa) => {
		if (fornecedor && despesa.FORNECEDOR) {
			if (
				!despesa.FORNECEDOR.toLowerCase().includes(fornecedor.toLowerCase())
			) {
				return false;
			}
		}

		return true;
	});
}
