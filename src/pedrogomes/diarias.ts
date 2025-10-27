import { Katalist } from "katalist";
import z from "zod";
import type { DiariasSchemaType } from "../../http-schemas/Diarias";
import { BASE_URL, companies } from "../shared/constants";

const kat = Katalist();

export const GetDiariasSearchSchema = z.object({
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
	favorecido: z.string().optional().describe("Nome do favorecido da diária."),
	cargo: z.string().optional().describe("Cargo do favorecido."),
	orgao: z.string().optional().describe("Órgão responsável."),
	unidade: z.string().optional().describe("Unidade do favorecido."),
	nomeUnidade: z.string().optional().describe("Nome da unidade."),
	codigoUnidade: z.string().optional().describe("Código da unidade."),
	nomeElemento: z.string().optional().describe("Nome do elemento de despesa."),
	descricao: z.string().optional().describe("Descrição da diária."),
	cpfFormatado: z.string().optional().describe("CPF formatado do favorecido."),
});

export async function diarias({
	diaInicio,
	mesInicio,
	diaFinal,
	mesFinal,
	exercicio,
	empresa,
	mostraDadosConsolidado,
	favorecido,
	cargo,
	orgao,
	unidade,
	nomeUnidade,
	codigoUnidade,
	nomeElemento,
	descricao,
	cpfFormatado,
}: z.infer<typeof GetDiariasSearchSchema>) {
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

	const diariasParams = new URLSearchParams();
	diariasParams.set("Listagem", "Diarias");
	diariasParams.set("DiaInicioPeriodo", diaInicio);
	diariasParams.set("MesInicialPeriodo", mesInicio);
	diariasParams.set("DiaFinalPeriodo", diaFinal);
	diariasParams.set("MesFinalPeriodo", mesFinal);
	diariasParams.set("Exercicio", exercicioToUse);
	diariasParams.set(
		"MostraDadosConsolidado",
		mostraDadosConsolidado.toString(),
	);

	console.log(`${BASE_URL}/Despesas/?${diariasParams.toString()}`);

	const urls = [];

	for (const company in companies) {
		urls.push(
			`${BASE_URL}/Despesas/?${diariasParams.toString()}&Empresa=${company}`,
		);
	}

	const diarias = await Promise.all(
		urls.map((url) =>
			kat.get<DiariasSchemaType>(url, {
				headers: {
					Cookie: cookies ?? "",
				},
			}),
		),
	);

	const diariasData = (
		await Promise.all(diarias.map((diaria) => diaria.json()))
	).flat();

	return diariasData.filter((diaria) => {
		if (favorecido && diaria.FAVORECIDO) {
			if (!diaria.FAVORECIDO.toLowerCase().includes(favorecido.toLowerCase())) {
				return false;
			}
		}

		if (cargo && diaria.CARGO) {
			if (!diaria.CARGO.toLowerCase().includes(cargo.toLowerCase())) {
				return false;
			}
		}

		if (orgao && diaria.ORGAO && orgao !== "") {
			if (!diaria.ORGAO.toLowerCase().includes(orgao.toLowerCase())) {
				return false;
			}
		}

		if (unidade && diaria.UNIDADE) {
			if (!diaria.UNIDADE.toLowerCase().includes(unidade.toLowerCase())) {
				return false;
			}
		}

		if (nomeUnidade && diaria.NOMEUNIDADE) {
			if (
				!diaria.NOMEUNIDADE.toLowerCase().includes(nomeUnidade.toLowerCase())
			) {
				return false;
			}
		}

		if (codigoUnidade && diaria.CODUNIDADE) {
			if (
				!diaria.CODUNIDADE.toLowerCase().includes(codigoUnidade.toLowerCase())
			) {
				return false;
			}
		}

		if (nomeElemento && diaria.NOME_ELEMENTO) {
			if (
				!diaria.NOME_ELEMENTO.toLowerCase().includes(nomeElemento.toLowerCase())
			) {
				return false;
			}
		}

		if (descricao && diaria.DESCRICAO) {
			if (!diaria.DESCRICAO.toLowerCase().includes(descricao.toLowerCase())) {
				return false;
			}
		}

		if (cpfFormatado && diaria.CPFFORMATADO) {
			if (
				!diaria.CPFFORMATADO.toLowerCase().includes(cpfFormatado.toLowerCase())
			) {
				return false;
			}
		}

		return true;
	});
}

diarias({
	diaInicio: "01",
	mesInicio: "01",
	diaFinal: new Date().getDate().toString().padStart(2, "0"),
	mesFinal: (new Date().getMonth() + 1).toString().padStart(2, "0"),
	empresa: "5",
	mostraDadosConsolidado: false,
	exercicio: "2025",
	favorecido: "Reinaldo",
}).then(console.log);
