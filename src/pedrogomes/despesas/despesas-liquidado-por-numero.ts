import { Katalist } from "katalist";
import z from "zod";
import type { DespesasLiquidadoPorNumeroSchemaType } from "../../../http-schemas/DespesasLiquidadoPorNumero";
import { BASE_URL } from "../../shared/constants";

const kat = Katalist();

export const GetDespesasLiquidadoPorNumeroSearchSchema = z.object({
	numeroEmpenho: z.string().describe("Número do empenho a ser consultado."),
	tipoEmpenho: z
		.string()
		.describe("Tipo do empenho. Exemplo: 'OR', 'ES', 'GL'."),
	diaInicio: z.string().describe("Dia inicial do período (01-31)."),
	mesInicio: z.string().describe("Mês inicial do período (01-12)."),
	diaFinal: z.string().describe("Dia final do período (01-31)."),
	mesFinal: z.string().describe("Mês final do período (01-12)."),
	exercicio: z.string().optional().describe("Ano fiscal. Padrão: ano atual."),
	empresa: z
		.string()
		.describe(
			"Código da empresa/entidade (formato: '1', '2', etc.). Deve ser uma string sem zeros à esquerda. Exemplo: '1'.",
		),
	idButton: z
		.string()
		.describe("Tipo de listagem. Geralmente 'lnkDespesasPor_NotaEmpenho'."),
	mostrarFornecedor: z.boolean().describe("Mostrar nome do fornecedor."),
	mostraDadosConsolidado: z.boolean().describe("Mostrar dados consolidados."),
	favorecido: z
		.string()
		.optional()
		.describe("Nome do favorecido para filtrar."),
	historico: z
		.string()
		.optional()
		.describe("Histórico/descrição para filtrar."),
});

export async function despesasLiquidadoPorNumero({
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
}: z.infer<typeof GetDespesasLiquidadoPorNumeroSearchSchema>) {
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

	const despesasLiquidadoParams = new URLSearchParams();
	despesasLiquidadoParams.set(
		"Listagem",
		"EmpenhosDespesas_Liquidado_PorNumeroEmpenho",
	);
	despesasLiquidadoParams.set("intNumeroEmpenho", numeroEmpenho);
	despesasLiquidadoParams.set("strTipoEmpenho", tipoEmpenho);
	despesasLiquidadoParams.set("DiaInicioPeriodo", diaInicio);
	despesasLiquidadoParams.set("MesInicialPeriodo", mesInicio);
	despesasLiquidadoParams.set("DiaFinalPeriodo", diaFinal);
	despesasLiquidadoParams.set("MesFinalPeriodo", mesFinal);
	despesasLiquidadoParams.set("Exercicio", exercicioToUse);
	despesasLiquidadoParams.set("Empresa", empresa);
	despesasLiquidadoParams.set("IDButton", idButton);
	despesasLiquidadoParams.set(
		"bolMostrarFornecedor",
		mostrarFornecedor.toString(),
	);
	despesasLiquidadoParams.set(
		"MostraDadosConsolidado",
		mostraDadosConsolidado.toString(),
	);

	const despesasLiquidado = await kat.get<DespesasLiquidadoPorNumeroSchemaType>(
		`${BASE_URL}/Despesas/?${despesasLiquidadoParams.toString()}`,
		{
			headers: {
				Cookie: cookies ?? "",
			},
		},
	);

	const despesasLiquidadoData = (await despesasLiquidado.json()) ?? [];

	return despesasLiquidadoData.filter((despesa) => {
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
