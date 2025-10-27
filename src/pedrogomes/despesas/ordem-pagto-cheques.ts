import { Katalist } from "katalist";
import z from "zod";
import type { OrdemPagtoChequesSchemaType } from "../../../http-schemas/OrdemPagtoCheques";
import { BASE_URL } from "../../shared/constants";

const kat = Katalist();

export const GetOrdemPagtoChequesSearchSchema = z.object({
	numeroEmpenho: z.string().describe("Número do empenho a ser consultado."),
	tipoEmpenho: z
		.string()
		.describe("Tipo do empenho. Exemplo: 'OR', 'ES', 'GL'."),
	empresa: z
		.string()
		.describe(
			"Código da empresa/entidade (formato: '1', '2', etc.). Deve ser uma string sem zeros à esquerda. Exemplo: '1'.",
		),
	numeroPagto: z.string().describe("Número da ordem de pagamento."),
});

export async function ordemPagtoCheques({
	numeroEmpenho,
	tipoEmpenho,
	empresa,
	numeroPagto,
}: z.infer<typeof GetOrdemPagtoChequesSearchSchema>) {
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

	const ordemPagtoChequesParams = new URLSearchParams();
	ordemPagtoChequesParams.set(
		"Listagem",
		"OrdemPagto_Cheques_PorNumeroEmpenho",
	);
	ordemPagtoChequesParams.set("intNumeroEmpenho", numeroEmpenho);
	ordemPagtoChequesParams.set("strTipoEmpenho", tipoEmpenho);
	ordemPagtoChequesParams.set("Empresa", empresa);
	ordemPagtoChequesParams.set("strNumeroPagto", numeroPagto);

	const ordemPagtoCheques = await kat.get<OrdemPagtoChequesSchemaType>(
		`${BASE_URL}/Despesas/?${ordemPagtoChequesParams.toString()}`,
		{
			headers: {
				Cookie: cookies ?? "",
			},
		},
	);

	const ordemPagtoChequesData = (await ordemPagtoCheques.json()) ?? [];

	return ordemPagtoChequesData;
}
