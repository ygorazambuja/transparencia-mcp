import { Katalist } from "katalist";
import z from "zod";
import type { DespesasPagoComOrdemSchemaType } from "../../../http-schemas/DespesasPagoComOrdem";
import { BASE_URL } from "../../shared/constants";

const kat = Katalist();

export const GetDespesasPagoComOrdemSearchSchema = z.object({
	numeroEmpenho: z.string().describe("Número do empenho a ser consultado."),
	tipoEmpenho: z
		.string()
		.describe("Tipo do empenho. Exemplo: 'OR', 'ES', 'GL'."),
	empresa: z
		.string()
		.describe(
			"Código da empresa/entidade (formato: '1', '2', etc.). Deve ser uma string sem zeros à esquerda. Exemplo: '1'.",
		),
});

export async function despesasPagoComOrdem({
	numeroEmpenho,
	tipoEmpenho,
	empresa,
}: z.infer<typeof GetDespesasPagoComOrdemSearchSchema>) {
	const currentYear = new Date().getFullYear().toString();

	const defineExericioParams = new URLSearchParams();
	defineExericioParams.set("Listagem", "DefineExercicio");
	defineExericioParams.set("Empresa", empresa);
	defineExericioParams.set("MostraDadosConsolidado", "true");
	defineExericioParams.set("ConectarExercicio", currentYear);

	const defineExercicio = await kat.get(
		`${BASE_URL}/Despesas/?${defineExericioParams.toString()}`,
	);

	const cookies = defineExercicio.headers.get("Set-Cookie");

	const despesasPagoComOrdemParams = new URLSearchParams();
	despesasPagoComOrdemParams.set(
		"Listagem",
		"Empenhos_Pago_ComOrdemPagto_PorNumeroEmpenho",
	);
	despesasPagoComOrdemParams.set("intNumeroEmpenho", numeroEmpenho);
	despesasPagoComOrdemParams.set("strTipoEmpenho", tipoEmpenho);
	despesasPagoComOrdemParams.set("Empresa", empresa);

	const despesasPagoComOrdem = await kat.get<DespesasPagoComOrdemSchemaType>(
		`${BASE_URL}/Despesas/?${despesasPagoComOrdemParams.toString()}`,
		{
			headers: {
				Cookie: cookies ?? "",
			},
		},
	);

	const despesasPagoComOrdemData = (await despesasPagoComOrdem.json()) ?? [];

	return despesasPagoComOrdemData;
}
