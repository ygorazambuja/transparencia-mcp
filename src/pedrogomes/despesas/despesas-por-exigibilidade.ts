import { Katalist } from "katalist";
import z from "zod";
import type { DespesasPorExigibilidadeSchemaType } from "../../../http-schemas/DespesasPorExigibilidade";
import { BASE_URL } from "../../shared/constants";

const kat = Katalist();

export const GetDespesasPorExigibilidadeSearchSchema = z.object({
	empresa: z
		.string()
		.describe(
			"Código do setor/empresa (formato: '1', '2', etc.). Deve ser uma string sem zeros à esquerda representando a entidade/departamento governamental. Exemplo: '1' para a entidade principal. Use '1' como padrão se desconhecido.",
		),
	exercicio: z
		.string()
		.optional()
		.describe(
			"Ano fiscal (formato: '2023', '2024', etc.). Deve ser uma string de ano de 4 dígitos. Exemplo: '2023' para dados do ano de 2023. Se não informado, será usado o ano atual.",
		),
	mostraDadosConsolidado: z
		.boolean()
		.describe(
			"Se deve mostrar dados consolidados em todas as entidades (true) ou dados apenas para uma entidade específica (false). Use false para dados detalhados, true para resumo agregado.",
		),
	mostrarFornecedor: z
		.boolean()
		.describe(
			"Se deve mostrar o nome do fornecedor/favorecido nos resultados (true) ou não (false).",
		),
	filtroVencimento: z
		.enum(["Vencidos", "AVencer", "Todos"])
		.describe(
			"Filtro por status de vencimento: 'Vencidos' (já vencidos), 'AVencer' (ainda não vencidos), ou 'Todos' para ambos.",
		),
	favorecido: z
		.string()
		.optional()
		.describe("Nome do favorecido para filtrar."),
	historico: z
		.string()
		.optional()
		.describe("Histórico/descrição para filtrar."),
	tipo: z.string().optional().describe("Tipo de despesa para filtrar."),
});

export async function despesasPorExigibilidade({
	empresa,
	exercicio,
	mostraDadosConsolidado,
	mostrarFornecedor,
	filtroVencimento,
	favorecido,
	historico,
	tipo,
}: z.infer<typeof GetDespesasPorExigibilidadeSearchSchema>) {
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

	const despesasPorExigibilidadeParams = new URLSearchParams();
	despesasPorExigibilidadeParams.set("Listagem", "DespesasPorExigibilidade");
	despesasPorExigibilidadeParams.set("Exercicio", exercicioToUse);
	despesasPorExigibilidadeParams.set("Empresa", empresa);
	despesasPorExigibilidadeParams.set(
		"MostraDadosConsolidado",
		mostraDadosConsolidado.toString(),
	);
	despesasPorExigibilidadeParams.set(
		"MostrarFornecedor",
		mostrarFornecedor.toString(),
	);
	despesasPorExigibilidadeParams.set("FiltroVencimento", filtroVencimento);

	const despesasPorExigibilidade =
		await kat.get<DespesasPorExigibilidadeSchemaType>(
			`${BASE_URL}/Despesas/?${despesasPorExigibilidadeParams.toString()}`,
			{
				headers: {
					Cookie: cookies ?? "",
				},
			},
		);

	const despesasPorExigibilidadeData =
		(await despesasPorExigibilidade.json()) ?? [];

	return despesasPorExigibilidadeData.filter((despesa) => {
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

		if (tipo && despesa.TIPO) {
			if (!despesa.TIPO.toLowerCase().includes(tipo.toLowerCase())) {
				return false;
			}
		}

		return true;
	});
}
