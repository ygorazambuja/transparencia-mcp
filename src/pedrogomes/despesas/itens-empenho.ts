import { Katalist } from "katalist";
import z from "zod";
import type { ItensEmpenhoSchemaType } from "../../../http-schemas/ItensEmpenho";
import { BASE_URL } from "../../shared/constants";

const kat = Katalist();

export const GetItensEmpenhoSearchSchema = z.object({
	numeroEmpenho: z
		.string()
		.describe("Número do empenho a ser consultado. Exemplo: '1', '123', etc."),
	tipoEmpenho: z
		.string()
		.describe(
			"Tipo do empenho. Valores comuns: 'OR' (ordinário), 'ES' (estimativo), 'GL' (global). Exemplo: 'OR'.",
		),
	empresa: z
		.string()
		.describe(
			"Código do setor/empresa (formato: '1', '2', etc.). Deve ser uma string sem zeros à esquerda representando a entidade/departamento governamental. Exemplo: '1' para a entidade principal. Use '1' como padrão se desconhecido.",
		),
	descricao: z.string().optional().describe("Descrição do item para filtrar."),
});

export async function itensEmpenho({
	numeroEmpenho,
	tipoEmpenho,
	empresa,
	descricao,
}: z.infer<typeof GetItensEmpenhoSearchSchema>) {
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

	const itensEmpenhoParams = new URLSearchParams();
	itensEmpenhoParams.set("Listagem", "ItensEmpenhoPorNumeroEmpenho");
	itensEmpenhoParams.set("intNumeroEmpenho", numeroEmpenho);
	itensEmpenhoParams.set("strTipoEmpenho", tipoEmpenho);
	itensEmpenhoParams.set("Empresa", empresa);

	const itensEmpenho = await kat.get<ItensEmpenhoSchemaType>(
		`${BASE_URL}/Despesas/?${itensEmpenhoParams.toString()}`,
		{
			headers: {
				Cookie: cookies ?? "",
			},
		},
	);

	const itensEmpenhoData = (await itensEmpenho.json()) ?? [];

	return itensEmpenhoData.filter((item) => {
		if (descricao && item.DESCRICAO) {
			if (!item.DESCRICAO.toLowerCase().includes(descricao.toLowerCase())) {
				return false;
			}
		}

		return true;
	});
}
