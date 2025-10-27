import { Katalist } from "katalist";
import z from "zod";
import type { ReceitaEstadoSchemaType } from "../../http-schemas/ReceitaEstado";
import { BASE_URL } from "../shared/constants";

const kat = Katalist();

export const GetReceitaEstadoSearchSchema = z.object({
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
});

export async function receitaEstado({
	diaInicio,
	mesInicio,
	diaFinal,
	mesFinal,
	exercicio,
	empresa,
	mostraDadosConsolidado,
}: z.infer<typeof GetReceitaEstadoSearchSchema>) {
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
	receitaParams.set("Listagem", "ReceitaEstado");
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

	const receita = await kat.get<ReceitaEstadoSchemaType>(
		`${BASE_URL}/Receitas/?${receitaParams.toString()}`,
		{
			headers: {
				Cookie: cookies ?? "",
			},
		},
	);

	return receita.json() ?? [];
}
