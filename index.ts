import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
	contratos,
	GetContratosSearchSchema,
} from "./src/pedrogomes/contratos";
import {
	detalhesReceitaOrcamentaria,
	GetDetalhesReceitaOrcamentariaSearchSchema,
} from "./src/pedrogomes/detalhes-receita-orcamentaria";
import { diarias, GetDiariasSearchSchema } from "./src/pedrogomes/diarias";
import {
	GetReceitaEstadoSearchSchema,
	receitaEstado,
} from "./src/pedrogomes/receita-estado";
import {
	GetReceitaExtraOrcamentariaSearchSchema,
	receitaExtraOrcamentaria,
} from "./src/pedrogomes/receita-extra-orcamentaria";
import {
	GetReceitaOrcamentariaSearchSchema,
	receitaOrcamentaria,
} from "./src/pedrogomes/receita-orcamentaria";
import {
	GetReceitaUniaoSearchSchema,
	receitaUniao,
} from "./src/pedrogomes/receita-uniao";
import {
	GetServidoresSearchSchema,
	servidores,
} from "./src/pedrogomes/servidores";
import { companies } from "./src/shared/constants";

const mcpServer = new McpServer({
	name: "Transparência MCP",
	version: "1.0.0",
	capabilities: {
		tools: {},
	},
});

mcpServer.tool(
	"diarias",
	"Recupera dados de diárias (auxílios de viagem) do portal de transparência da prefeitura para um período específico. Retorna informações detalhadas sobre auxílios de viagem pagos a servidores públicos municipais. Parâmetros obrigatórios: diaInicio, mesInicio, diaFinal, mesFinal, empresa, mostraDadosConsolidado. Parâmetros opcionais: exercicio (padrão: ano atual), favorecido, cargo, orgao, unidade, nomeUnidade, codigoUnidade, nomeElemento, descricao, cpfFormatado.",
	GetDiariasSearchSchema.shape,
	async (input) => {
		const result = await diarias(input);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify({ diarias: result }),
				},
			],
		};
	},
);

mcpServer.tool(
	"contratos",
	"Recupera dados de contratos do portal de transparência da prefeitura para um exercício específico. Retorna informações sobre contratos públicos municipais. Todos os parâmetros são OBRIGATÓRIOS - não use 'TODAS' nem deixe nenhum campo vazio.",
	GetContratosSearchSchema.shape,
	async (input) => {
		const result = await contratos(input);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify({ contratos: result }),
				},
			],
		};
	},
);

mcpServer.tool(
	"servidores",
	"Recupera dados de servidores do portal de transparência da prefeitura para um exercício e mês específicos. Retorna informações sobre servidores públicos municipais. Todos os parâmetros são OBRIGATÓRIOS - não use 'TODAS' nem deixe nenhum campo vazio.",
	GetServidoresSearchSchema.shape,
	async (input) => {
		const result = await servidores(input);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify({ servidores: result }),
				},
			],
		};
	},
);

mcpServer.tool(
	"empresas",
	"Recupera dados das empresas do portal de transparência da prefeitura",
	z.object({
		nomeEmpresa: z.string().optional(),
	}).shape,
	async (input) => {
		if (!input.nomeEmpresa) {
			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(companies),
					},
				],
			};
		}

		const result = companies.filter(({ descricao }) =>
			descricao
				.toLowerCase()
				.includes((input.nomeEmpresa as string).toLowerCase()),
		);

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result),
				},
			],
		};
	},
);

mcpServer.tool(
	"receita-orcamentaria",
	"Recupera dados de receita orçamentária do portal de transparência da prefeitura para um período específico. Retorna informações sobre receitas previstas e arrecadadas. Parâmetros obrigatórios: diaInicio, mesInicio, diaFinal, mesFinal, empresa, mostraDadosConsolidado. Parâmetros opcionais: exercicio (padrão: ano atual), codigoReceita, vinCodigo, fonte, nomeReceita.",
	GetReceitaOrcamentariaSearchSchema.shape,
	async (input) => {
		const result = await receitaOrcamentaria(input);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify({ receitaOrcamentaria: result }),
				},
			],
		};
	},
);

mcpServer.tool(
	"receita-uniao",
	"Recupera dados de receita da União do portal de transparência da prefeitura para um período específico. Retorna informações sobre receitas federais transferidas previstas e arrecadadas. Parâmetros obrigatórios: diaInicio, mesInicio, diaFinal, mesFinal, empresa, mostraDadosConsolidado. Parâmetros opcionais: exercicio (padrão: ano atual).",
	GetReceitaUniaoSearchSchema.shape,
	async (input) => {
		const result = await receitaUniao(input);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify({ receitaUniao: result }),
				},
			],
		};
	},
);

mcpServer.tool(
	"receita-estado",
	"Recupera dados de receita estadual do portal de transparência da prefeitura para um período específico. Retorna informações sobre receitas estaduais transferidas previstas e arrecadadas. Parâmetros obrigatórios: diaInicio, mesInicio, diaFinal, mesFinal, empresa, mostraDadosConsolidado. Parâmetros opcionais: exercicio (padrão: ano atual).",
	GetReceitaEstadoSearchSchema.shape,
	async (input) => {
		const result = await receitaEstado(input);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify({ receitaEstado: result }),
				},
			],
		};
	},
);

mcpServer.tool(
	"receita-extra-orcamentaria",
	"Recupera dados de receita extra orçamentária do portal de transparência da prefeitura para um período específico. Retorna informações sobre receitas extra orçamentárias arrecadadas. Parâmetros obrigatórios: diaInicio, mesInicio, diaFinal, mesFinal, empresa, mostraDadosConsolidado. Parâmetros opcionais: exercicio (padrão: ano atual).",
	GetReceitaExtraOrcamentariaSearchSchema.shape,
	async (input) => {
		const result = await receitaExtraOrcamentaria(input);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify({ receitaExtraOrcamentaria: result }),
				},
			],
		};
	},
);

mcpServer.tool(
	"detalhes-receita-orcamentaria",
	"Recupera detalhes de uma receita orçamentária específica do portal de transparência da prefeitura para um período específico. Requer o código da receita. Parâmetros obrigatórios: diaInicio, mesInicio, diaFinal, mesFinal, empresa, codigochave, mostraDadosConsolidado. Parâmetros opcionais: exercicio (padrão: ano atual).",
	GetDetalhesReceitaOrcamentariaSearchSchema.shape,
	async (input) => {
		const result = await detalhesReceitaOrcamentaria(input);
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify({ detalhesReceitaOrcamentaria: result }),
				},
			],
		};
	},
);

const transport = new StdioServerTransport();
await mcpServer.connect(transport);
