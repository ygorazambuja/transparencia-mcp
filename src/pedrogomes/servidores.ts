import { Katalist } from "katalist";
import z from "zod";
import type { ServidoresSchemaType } from "../../http-schemas/Servidores";
import { BASE_URL } from "../shared/constants";

const kat = Katalist();

export const GetServidoresSearchSchema = z.object({
	exercicio: z
		.string()
		.default(new Date().getFullYear().toString())
		.describe(
			"Ano fiscal (formato: '2023', '2024', etc.). Deve ser uma string de ano de 4 dígitos. Exemplo: '2023' para dados do ano de 2023. Se não informado, será usado o ano atual.",
		),
	empresa: z
		.string()
		.describe(
			"Código do setor/empresa (formato: '1', '2', etc.). Deve ser uma string sem zeros à esquerda representando a entidade/departamento governamental. Exemplo: '1' para a entidade principal. Use '1' como padrão se desconhecido.",
		),
	mesFinal: z
		.string()
		.default((new Date().getMonth() + 1).toString().padStart(2, "0"))
		.describe(
			"Mês final do período (formato: '01' a '12'). Deve ser uma string de 2 dígitos. Exemplo: '01' para janeiro, '12' para dezembro.",
		),
	nomeDoServidor: z
		.string()
		.optional()
		.describe("Nome do servidor a ser buscado."),
	divisao: z.string().optional().describe("Divisão do servidor."),
	subdivisao: z.string().optional().describe("Subdivisão do servidor."),
	unidade: z.string().optional().describe("Unidade do servidor."),
	cargo: z.string().optional().describe("Cargo do servidor."),
	vinculo: z.string().optional().describe("Vínculo do servidor."),
	categoriaFuncional: z
		.string()
		.optional()
		.describe("Categoria funcional do servidor."),
	situacaoFuncional: z
		.string()
		.optional()
		.describe("Situação funcional do servidor."),
});

export async function servidores({
	exercicio,
	empresa,
	mesFinal,
	nomeDoServidor,
	divisao,
	subdivisao,
	unidade,
	cargo,
	vinculo,
	categoriaFuncional,
	situacaoFuncional,
}: z.infer<typeof GetServidoresSearchSchema>) {
	try {
		const exercicioToUse = exercicio;

		// 1. DefineExercicio - get session cookies
		const defineExericioParams = new URLSearchParams();
		defineExericioParams.set("Listagem", "DefineExercicio");
		defineExericioParams.set("Empresa", empresa);
		defineExericioParams.set("ConectarExercicio", exercicioToUse);

		const defineExercicio = await kat.get(
			`${BASE_URL}/Pessoal/?${defineExericioParams.toString()}`,
		);

		const cookies = defineExercicio.headers.get("Set-Cookie");

		// 2. Main API call with cookies
		const servidoresParams = new URLSearchParams();
		servidoresParams.set("Listagem", "Servidores");
		servidoresParams.set("Empresa", empresa);
		servidoresParams.set("Exercicio", exercicioToUse);
		servidoresParams.set("MesFinalPeriodo", mesFinal);

		const servidores =
			(await kat
				.get<ServidoresSchemaType>(
					`${BASE_URL}/Pessoal/?${servidoresParams.toString()}`,
					{
						headers: {
							Cookie: cookies ?? "",
						},
					},
				)
				.json()) ?? [];

		// 3. Apply client-side filters
		return servidores.filter((servidor) => {
			if (nomeDoServidor && servidor.NOME) {
				if (
					!servidor.NOME.toLowerCase().includes(nomeDoServidor.toLowerCase())
				) {
					return false;
				}
			}

			if (divisao && servidor.DIVISAO) {
				if (!servidor.DIVISAO.toLowerCase().includes(divisao.toLowerCase())) {
					return false;
				}
			}

			if (subdivisao && servidor.SUBDIVISAO) {
				if (
					!servidor.SUBDIVISAO.toLowerCase().includes(subdivisao.toLowerCase())
				) {
					return false;
				}
			}

			if (unidade && servidor.UNIDADE) {
				if (!servidor.UNIDADE.toLowerCase().includes(unidade.toLowerCase())) {
					return false;
				}
			}

			if (cargo && servidor.CARGO) {
				if (!servidor.CARGO.toLowerCase().includes(cargo.toLowerCase())) {
					return false;
				}
			}

			if (vinculo && servidor.VINCULO) {
				if (!servidor.VINCULO.toLowerCase().includes(vinculo.toLowerCase())) {
					return false;
				}
			}

			if (categoriaFuncional && servidor.CATEGORIAFUNCIONAL) {
				if (
					!servidor.CATEGORIAFUNCIONAL.toLowerCase().includes(
						categoriaFuncional.toLowerCase(),
					)
				) {
					return false;
				}
			}

			if (situacaoFuncional && servidor.SITUACAOFUNCIONAL) {
				if (
					!servidor.SITUACAOFUNCIONAL.toLowerCase().includes(
						situacaoFuncional.toLowerCase(),
					)
				) {
					return false;
				}
			}

			return true;
		});
	} catch (error) {
		console.error("Erro ao buscar servidores:", error);
		return [];
	}
}
