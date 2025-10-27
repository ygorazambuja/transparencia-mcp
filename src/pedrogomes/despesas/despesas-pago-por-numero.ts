import { Katalist } from "katalist";
import z from "zod";
import type { DespesasPagoPorNumeroSchemaType } from "../../../http-schemas/DespesasPagoPorNumero";
import { BASE_URL } from "../../shared/constants";

const kat = Katalist();

export const GetDespesasPagoPorNumeroSearchSchema = z.object({
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

export async function despesasPagoPorNumero({
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
}: z.infer<typeof GetDespesasPagoPorNumeroSearchSchema>) {
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

	const despesasPagoParams = new URLSearchParams();
	despesasPagoParams.set("Listagem", "EmpenhosDespesas_Pago_PorNumeroEmpenho");
	despesasPagoParams.set("intNumeroEmpenho", numeroEmpenho);
	despesasPagoParams.set("strTipoEmpenho", tipoEmpenho);
	despesasPagoParams.set("DiaInicioPeriodo", diaInicio);
	despesasPagoParams.set("MesInicialPeriodo", mesInicio);
	despesasPagoParams.set("DiaFinalPeriodo", diaFinal);
	despesasPagoParams.set("MesFinalPeriodo", mesFinal);
	despesasPagoParams.set("Exercicio", exercicioToUse);
	despesasPagoParams.set("Empresa", empresa);
	despesasPagoParams.set("IDButton", idButton);
	despesasPagoParams.set("MostrarFornecedor", mostrarFornecedor.toString());
	despesasPagoParams.set(
		"MostraDadosConsolidado",
		mostraDadosConsolidado.toString(),
	);

	const despesasPago = await kat.get<DespesasPagoPorNumeroSchemaType>(
		`${BASE_URL}/Despesas/?${despesasPagoParams.toString()}`,
		{
			headers: {
				Cookie: cookies ?? "",
			},
		},
	);

	const despesasPagoData = (await despesasPago.json()) ?? [];

	return despesasPagoData.filter((despesa) => {
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
