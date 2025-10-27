import { Katalist } from "katalist";
import z from "zod";
import type { ContratosSchemaType } from "../../http-schemas/Contratos";
import { BASE_URL } from "../shared/constants";

const kat = Katalist();

export const GetContratosSearchSchema = z.object({
	exercicio: z
		.string()
		.describe(
			"Ano fiscal (formato: '2023', '2024', etc.). Deve ser uma string de ano de 4 dígitos. Exemplo: '2023' para dados do ano de 2023.",
		),
	empresa: z
		.string()
		.describe(
			"Código do setor/empresa (formato: '1', '2', etc.). Deve ser uma string sem zeros à esquerda representando a entidade/departamento governamental. Exemplo: '1' para a entidade principal. Use '1' como padrão se desconhecido.",
		),
});

export async function contratos({
	exercicio,
	empresa,
}: z.infer<typeof GetContratosSearchSchema>) {
	const defineExericioParams = new URLSearchParams();
	defineExericioParams.set("Listagem", "DefineExercicio");
	defineExericioParams.set("Empresa", empresa);
	defineExericioParams.set("ConectarExercicio", exercicio);

	const defineExercicio = await kat.get(
		`${BASE_URL}/LicitacoesEContratos/?${defineExericioParams.toString()}`,
	);

	const cookies = defineExercicio.headers.get("Set-Cookie");

	const contratosParams = new URLSearchParams();
	contratosParams.set("Listagem", "Contratos");
	contratosParams.set("Exercicio", exercicio);
	contratosParams.set("Empresa", empresa);

	const contratos = await kat.get<ContratosSchemaType>(
		`${BASE_URL}/LicitacoesEContratos/?${contratosParams.toString()}`,
		{
			headers: {
				Cookie: cookies ?? "",
			},
		},
	);

	return contratos.json() ?? [];
}
