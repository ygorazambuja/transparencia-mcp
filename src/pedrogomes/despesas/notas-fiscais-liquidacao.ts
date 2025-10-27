import { Katalist } from "katalist";
import z from "zod";
import type { NotasFiscaisLiquidacaoSchemaType } from "../../../http-schemas/NotasFiscaisLiquidacao";
import { BASE_URL } from "../../shared/constants";

const kat = Katalist();

export const GetNotasFiscaisLiquidacaoSearchSchema = z.object({
	numeroEmpenho: z.string().describe("Número do empenho a ser consultado."),
	tipoEmpenho: z
		.string()
		.describe("Tipo do empenho. Exemplo: 'OR', 'ES', 'GL'."),
	empresa: z
		.string()
		.describe(
			"Código da empresa/entidade (formato: '1', '2', etc.). Deve ser uma string sem zeros à esquerda. Exemplo: '1'.",
		),
	numeroLiquidacao: z.string().describe("Número da liquidação."),
	fornecedor: z
		.string()
		.optional()
		.describe("Nome do fornecedor para filtrar."),
});

export async function notasFiscaisLiquidacao({
	numeroEmpenho,
	tipoEmpenho,
	empresa,
	numeroLiquidacao,
	fornecedor,
}: z.infer<typeof GetNotasFiscaisLiquidacaoSearchSchema>) {
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

	const notasFiscaisLiquidacaoParams = new URLSearchParams();
	notasFiscaisLiquidacaoParams.set(
		"Listagem",
		"NotasEmpenhoLiquidacao_PorNumeroEmpenho",
	);
	notasFiscaisLiquidacaoParams.set("intNumeroEmpenho", numeroEmpenho);
	notasFiscaisLiquidacaoParams.set("strTipoEmpenho", tipoEmpenho);
	notasFiscaisLiquidacaoParams.set("Empresa", empresa);
	notasFiscaisLiquidacaoParams.set("strNumeroLiquidacao", numeroLiquidacao);

	const notasFiscaisLiquidacao =
		await kat.get<NotasFiscaisLiquidacaoSchemaType>(
			`${BASE_URL}/Despesas/?${notasFiscaisLiquidacaoParams.toString()}`,
			{
				headers: {
					Cookie: cookies ?? "",
				},
			},
		);

	const notasFiscaisLiquidacaoData =
		(await notasFiscaisLiquidacao.json()) ?? [];

	return notasFiscaisLiquidacaoData.filter((nota) => {
		if (fornecedor && nota.FORNECEDOR) {
			if (!nota.FORNECEDOR.toLowerCase().includes(fornecedor.toLowerCase())) {
				return false;
			}
		}

		return true;
	});
}
