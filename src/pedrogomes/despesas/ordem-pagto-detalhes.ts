import { Katalist } from "katalist";
import z from "zod";
import type { OrdemPagtoDetalhesSchemaType } from "../../../http-schemas/OrdemPagtoDetalhes";
import { BASE_URL } from "../../shared/constants";

const kat = Katalist();

export const GetOrdemPagtoDetalhesSearchSchema = z.object({
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

export async function ordemPagtoDetalhes({
	numeroEmpenho,
	tipoEmpenho,
	empresa,
	numeroPagto,
}: z.infer<typeof GetOrdemPagtoDetalhesSearchSchema>) {
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

	const ordemPagtoDetalhesParams = new URLSearchParams();
	ordemPagtoDetalhesParams.set(
		"Listagem",
		"OrdemPagto_Detalhes_PorNumeroEmpenho",
	);
	ordemPagtoDetalhesParams.set("intNumeroEmpenho", numeroEmpenho);
	ordemPagtoDetalhesParams.set("strTipoEmpenho", tipoEmpenho);
	ordemPagtoDetalhesParams.set("Empresa", empresa);
	ordemPagtoDetalhesParams.set("strNumeroPagto", numeroPagto);

	const ordemPagtoDetalhes = await kat.get<OrdemPagtoDetalhesSchemaType>(
		`${BASE_URL}/Despesas/?${ordemPagtoDetalhesParams.toString()}`,
		{
			headers: {
				Cookie: cookies ?? "",
			},
		},
	);

	const ordemPagtoDetalhesData = await ordemPagtoDetalhes.json();

	return ordemPagtoDetalhesData;
}
