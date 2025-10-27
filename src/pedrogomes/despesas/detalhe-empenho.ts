import { Katalist } from "katalist";
import z from "zod";
import type { DetalheEmpenhoSchemaType } from "../../../http-schemas/DetalheEmpenho";
import { BASE_URL } from "../../shared/constants";

const kat = Katalist();

export const GetDetalheEmpenhoSearchSchema = z.object({
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
	mostrarFornecedor: z
		.boolean()
		.describe(
			"Se deve mostrar o nome do fornecedor/favorecido nos resultados (true) ou não (false).",
		),
});

export async function detalheEmpenho({
	numeroEmpenho,
	tipoEmpenho,
	empresa,
	mostrarFornecedor,
}: z.infer<typeof GetDetalheEmpenhoSearchSchema>) {
	// Note: This endpoint may not require DefineExercicio, but we'll include it for consistency
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

	const detalheEmpenhoParams = new URLSearchParams();
	detalheEmpenhoParams.set("Listagem", "DetalhesEmpenhoPorNumeroEmpenho");
	detalheEmpenhoParams.set("intNumeroEmpenho", numeroEmpenho);
	detalheEmpenhoParams.set("strTipoEmpenho", tipoEmpenho);
	detalheEmpenhoParams.set("Empresa", empresa);
	detalheEmpenhoParams.set(
		"bolMostrarFornecedor",
		mostrarFornecedor.toString(),
	);

	const detalheEmpenho = await kat.get<DetalheEmpenhoSchemaType>(
		`${BASE_URL}/Despesas/?${detalheEmpenhoParams.toString()}`,
		{
			headers: {
				Cookie: cookies ?? "",
			},
		},
	);

	const detalheEmpenhoData = await detalheEmpenho.json();

	return detalheEmpenhoData;
}
