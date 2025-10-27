import { Katalist } from "katalist";
import z from "zod";
import type { OrdemPagtoParcelasSchemaType } from "../../../http-schemas/OrdemPagtoParcelas";
import { BASE_URL } from "../../shared/constants";

const kat = Katalist();

export const GetOrdemPagtoParcelasSearchSchema = z.object({
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

export async function ordemPagtoParcelas({
	numeroEmpenho,
	tipoEmpenho,
	empresa,
	numeroPagto,
}: z.infer<typeof GetOrdemPagtoParcelasSearchSchema>) {
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

	const ordemPagtoParcelasParams = new URLSearchParams();
	ordemPagtoParcelasParams.set(
		"Listagem",
		"OrdemPagto_Parcelas_PorNumeroEmpenho",
	);
	ordemPagtoParcelasParams.set("intNumeroEmpenho", numeroEmpenho);
	ordemPagtoParcelasParams.set("strTipoEmpenho", tipoEmpenho);
	ordemPagtoParcelasParams.set("Empresa", empresa);
	ordemPagtoParcelasParams.set("strNumeroPagto", numeroPagto);

	const ordemPagtoParcelas = await kat.get<OrdemPagtoParcelasSchemaType>(
		`${BASE_URL}/Despesas/?${ordemPagtoParcelasParams.toString()}`,
		{
			headers: {
				Cookie: cookies ?? "",
			},
		},
	);

	const ordemPagtoParcelasData = (await ordemPagtoParcelas.json()) ?? [];

	return ordemPagtoParcelasData;
}
