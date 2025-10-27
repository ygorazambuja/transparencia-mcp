# Transparência MCP - Guia de Desenvolvimento

Este projeto é um servidor MCP (Model Context Protocol) para acesso a dados de transparência pública brasileira, construído com **Bun** como runtime.

## Runtime: Bun

Este projeto usa **Bun** como runtime JavaScript/TypeScript ao invés de Node.js. Sempre use os comandos do Bun:

### Comandos Bun

- `bun <file>` - Executa arquivos TypeScript/JavaScript diretamente
- `bun install` - Instala dependências
- `bun run <script>` - Executa scripts do package.json
- `bun test` - Executa testes
- `bun --watch <file>` - Executa com hot reload

**NUNCA use:**
- `node`, `ts-node`, `nodemon`
- `npm install`, `yarn install`, `pnpm install`
- `npm run`, `yarn run`

### Vantagens do Bun

- **Performance**: Muito mais rápido que Node.js
- **TypeScript nativo**: Executa `.ts` sem necessidade de transpilação
- **Auto-load de .env**: Carrega automaticamente variáveis de ambiente
- **APIs modernas**: Bun.serve(), Bun.file(), etc.

## Estrutura do Projeto

```
transparencia-mcp/
├── index.ts                      # Servidor MCP principal
├── src/
│   ├── pedrogomes/              # Métodos de API do Portal Fiorilli
│   │   ├── diarias.ts           # Diárias (auxílios de viagem)
│   │   ├── contratos.ts         # Contratos públicos
│   │   ├── servidores.ts        # Dados de servidores públicos
│   │   ├── receita-orcamentaria.ts           # Receita orçamentária
│   │   ├── receita-uniao.ts                  # Receita da União
│   │   ├── receita-estado.ts                 # Receita estadual
│   │   ├── receita-extra-orcamentaria.ts     # Receita extra orçamentária
│   │   └── detalhes-receita-orcamentaria.ts  # Detalhes de receitas
│   └── shared/
│       └── constants.ts         # Constantes compartilhadas (BASE_URL, empresas)
├── http-schemas/                # Schemas Zod para validação de respostas HTTP
│   ├── Diarias.ts
│   ├── Contratos.ts
│   ├── Servidores.ts
│   ├── ReceitaOrcamentaria.ts
│   ├── ReceitaUniao.ts
│   ├── ReceitaEstado.ts
│   ├── ReceitaExtraOrcamentaria.ts
│   └── DetalhesReceitaOrcamentaria.ts
└── package.json
```

## Arquitetura do Projeto

### 1. Servidor MCP (index.ts)

O arquivo principal registra todas as ferramentas MCP usando `@modelcontextprotocol/sdk`:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const mcpServer = new McpServer({
  name: "Transparência MCP",
  version: "1.0.0",
  capabilities: { tools: {} },
});

// Registra ferramentas
mcpServer.tool("nome-da-ferramenta", "descrição", schema, handler);
```

### 2. Métodos de API (src/pedrogomes/*.ts)

Cada arquivo em `src/pedrogomes/` exporta:

1. **Schema Zod** para validação de parâmetros de entrada
2. **Função async** que faz requisições HTTP à API do Portal Fiorilli

**Padrão comum:**

```typescript
import { Katalist } from "katalist";
import z from "zod";
import type { SchemaType } from "../../http-schemas/Schema";
import { BASE_URL } from "../shared/constants";

const kat = Katalist();

// 1. Schema de validação de entrada
export const GetDataSearchSchema = z.object({
  exercicio: z.string().describe("Ano fiscal"),
  empresa: z.string().describe("Código da entidade"),
  // ... outros parâmetros
});

// 2. Função principal
export async function getData(input: z.infer<typeof GetDataSearchSchema>) {
  // 2.1. Chamada para DefineExercicio (obtém cookies de sessão)
  const defineExercicio = await kat.get(
    `${BASE_URL}/Endpoint/?Listagem=DefineExercicio&ConectarExercicio=${input.exercicio}`
  );

  const cookies = defineExercicio.headers.get("Set-Cookie");

  // 2.2. Chamada principal com cookies
  const response = await kat.get<SchemaType>(
    `${BASE_URL}/Endpoint/?Listagem=Data&...params`,
    { headers: { Cookie: cookies ?? "" } }
  );

  return response.json() ?? [];
}
```

### 3. Schemas HTTP (http-schemas/*.ts)

Cada schema define a estrutura esperada da resposta da API usando Zod:

```typescript
import { z } from "zod";

export const DataSchema = z.array(
  z.object({
    CAMPO1: z.string(),
    CAMPO2: z.string(),
    // ... outros campos
  })
);

export type DataSchemaType = z.infer<typeof DataSchema>;
```

## Ferramentas MCP Disponíveis

### Dados Financeiros

#### 1. `diarias`
Recupera dados de diárias (auxílios de viagem) pagos a servidores públicos.

**Parâmetros obrigatórios:**
- `diaInicio`, `mesInicio`, `diaFinal`, `mesFinal` - Período
- `empresa` - Código da entidade (ex: "1")
- `mostraDadosConsolidado` - true/false

**Parâmetros opcionais:**
- `exercicio` - Ano (padrão: ano atual)
- `favorecido`, `cargo`, `orgao`, `unidade`, `cpfFormatado` - Filtros

**Retorna:** Lista de diárias com favorecido, valor, descrição, órgão, etc.

**Arquivo:** `src/pedrogomes/diarias.ts`

#### 2. `receita-orcamentaria`
Recupera dados de receita orçamentária (receitas previstas vs arrecadadas).

**Parâmetros obrigatórios:**
- `diaInicio`, `mesInicio`, `diaFinal`, `mesFinal` - Período
- `empresa` - Código da entidade
- `mostraDadosConsolidado` - true/false

**Parâmetros opcionais:**
- `exercicio` - Ano (padrão: ano atual)
- `codigoReceita` - Código específico de receita
- `vinCodigo` - Código de vinculação
- `fonte` - Fonte de recursos
- `nomeReceita` - Filtro por nome

**Retorna:** Código, descrição, previsto, arrecadado, diferença, percentual

**Arquivo:** `src/pedrogomes/receita-orcamentaria.ts`

#### 3. `receita-uniao`
Recupera dados de receitas federais transferidas.

**Parâmetros:** Mesmos da receita-orcamentaria (sem filtros extras)

**Arquivo:** `src/pedrogomes/receita-uniao.ts`

#### 4. `receita-estado`
Recupera dados de receitas estaduais transferidas.

**Parâmetros:** Mesmos da receita-orcamentaria (sem filtros extras)

**Arquivo:** `src/pedrogomes/receita-estado.ts`

#### 5. `receita-extra-orcamentaria`
Recupera dados de receitas extra orçamentárias.

**Parâmetros:** Mesmos da receita-orcamentaria (sem filtros extras)

**Retorna:** Código, descrição, arrecadado (sem campo "previsto")

**Arquivo:** `src/pedrogomes/receita-extra-orcamentaria.ts`

#### 6. `detalhes-receita-orcamentaria`
Recupera detalhes de uma receita orçamentária específica.

**Parâmetros obrigatórios:**
- `diaInicio`, `mesInicio`, `diaFinal`, `mesFinal` - Período
- `empresa` - Código da entidade
- `codigochave` - Código da receita (ex: "1112.50.0.1")
- `mostraDadosConsolidado` - true/false

**Retorna:** Data, código, descrição, histórico, valor de cada movimentação

**Arquivo:** `src/pedrogomes/detalhes-receita-orcamentaria.ts`

### Dados Administrativos

#### 7. `contratos`
Recupera dados de contratos públicos.

**Parâmetros obrigatórios:**
- `exercicio` - Ano fiscal (ex: "2024")
- `empresa` - Código da entidade (ex: "1")

**Retorna:** Lista de contratos públicos

**Arquivo:** `src/pedrogomes/contratos.ts`

#### 8. `servidores`
Recupera dados de servidores públicos municipais.

**Parâmetros obrigatórios:**
- `exercicio` - Ano fiscal
- `empresa` - Código da entidade
- `mesFinalPeriodo` - Mês de referência

**Retorna:** Lista de servidores com dados funcionais

**Arquivo:** `src/pedrogomes/servidores.ts`

### Dados de Referência

#### 9. `empresas`
Lista todas as empresas/entidades disponíveis no portal.

**Parâmetros opcionais:**
- `nomeEmpresa` - Filtro por nome

**Retorna:** Lista de empresas com código e descrição

**Fonte:** `src/shared/constants.ts`

## Padrões de Código

### Sempre use Bun

```typescript
// ✅ CORRETO
import { Katalist } from "katalist";
const kat = Katalist();
await kat.get(url);

// ❌ ERRADO - Não use fetch/axios/node-fetch
import fetch from "node-fetch";
await fetch(url);
```

### Schemas Zod

Todos os parâmetros de entrada devem ter schemas Zod com descrições detalhadas:

```typescript
export const GetDataSchema = z.object({
  exercicio: z
    .string()
    .optional()
    .describe(
      "Ano fiscal (formato: '2023', '2024', etc.). Deve ser uma string de ano de 4 dígitos. Se não informado, será usado o ano atual."
    ),
  empresa: z
    .string()
    .describe(
      "Código do setor/empresa (formato: '1', '2', etc.). Deve ser uma string sem zeros à esquerda. Exemplo: '1' para a entidade principal."
    ),
});
```

### Tratamento de Exercício (Ano)

Sempre use o ano atual como padrão:

```typescript
const currentYear = new Date().getFullYear().toString();
const exercicioToUse = exercicio || currentYear;
```

### Chamadas à API

**Padrão de duas chamadas:**

1. **DefineExercicio** - Estabelece sessão e obtém cookies
2. **Chamada principal** - Usa cookies para obter dados

```typescript
// 1. DefineExercicio
const defineExercicio = await kat.get(
  `${BASE_URL}/Endpoint/?Listagem=DefineExercicio&ConectarExercicio=${exercicio}`
);
const cookies = defineExercicio.headers.get("Set-Cookie");

// 2. Chamada principal
const data = await kat.get<DataType>(
  `${BASE_URL}/Endpoint/?Listagem=Data&...`,
  { headers: { Cookie: cookies ?? "" } }
);

return data.json() ?? [];
```

### Filtros Opcionais

Filtros são aplicados após receber os dados (client-side):

```typescript
return data.filter((item) => {
  if (filtro && item.CAMPO) {
    if (!item.CAMPO.toLowerCase().includes(filtro.toLowerCase())) {
      return false;
    }
  }
  return true;
});
```

**Exceção:** Alguns filtros são enviados como query params (ex: `CodigoReceita` em receita-orcamentaria).

## Como Adicionar Nova Ferramenta

### 1. Criar Schema HTTP

```typescript
// http-schemas/NovaFuncionalidade.ts
import { z } from "zod";

export const NovaFuncionalidadeSchema = z.array(
  z.object({
    CAMPO1: z.string(),
    CAMPO2: z.string(),
  })
);

export type NovaFuncionalidadeSchemaType = z.infer<typeof NovaFuncionalidadeSchema>;
```

### 2. Criar Método de API

```typescript
// src/pedrogomes/nova-funcionalidade.ts
import { Katalist } from "katalist";
import z from "zod";
import type { NovaFuncionalidadeSchemaType } from "../../http-schemas/NovaFuncionalidade";
import { BASE_URL } from "../shared/constants";

const kat = Katalist();

export const GetNovaFuncionalidadeSearchSchema = z.object({
  exercicio: z.string().optional().describe("Ano fiscal"),
  empresa: z.string().describe("Código da entidade"),
});

export async function novaFuncionalidade({
  exercicio,
  empresa,
}: z.infer<typeof GetNovaFuncionalidadeSearchSchema>) {
  const currentYear = new Date().getFullYear().toString();
  const exercicioToUse = exercicio || currentYear;

  const defineExercicio = await kat.get(
    `${BASE_URL}/Endpoint/?Listagem=DefineExercicio&ConectarExercicio=${exercicioToUse}`
  );

  const cookies = defineExercicio.headers.get("Set-Cookie");

  const data = await kat.get<NovaFuncionalidadeSchemaType>(
    `${BASE_URL}/Endpoint/?Listagem=NovaFuncionalidade&Empresa=${empresa}`,
    { headers: { Cookie: cookies ?? "" } }
  );

  return data.json() ?? [];
}
```

### 3. Registrar no index.ts

```typescript
// index.ts
import {
  novaFuncionalidade,
  GetNovaFuncionalidadeSearchSchema,
} from "./src/pedrogomes/nova-funcionalidade";

mcpServer.tool(
  "nova-funcionalidade",
  "Descrição da nova funcionalidade",
  GetNovaFuncionalidadeSearchSchema.shape,
  async (input) => {
    const result = await novaFuncionalidade(input);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ novaFuncionalidade: result }),
        },
      ],
    };
  }
);
```

## API do Portal Fiorilli

### Endpoints Base

Todos os endpoints seguem o padrão:

```
{BASE_URL}/{Categoria}/?{Params}
```

**Categorias:**
- `/Receitas/` - Dados de receitas
- `/Despesas/` - Dados de despesas
- `/LicitacoesEContratos/` - Licitações e contratos
- `/Pessoal/` - Dados de pessoal

### Parâmetros Comuns

- `Listagem` - Tipo de listagem (ex: "ReceitaOrcamentaria", "DefineExercicio")
- `ConectarExercicio` - Ano fiscal para DefineExercicio
- `Exercicio` - Ano fiscal para queries
- `Empresa` - Código da entidade
- `MostraDadosConsolidado` - "true" ou "false"
- `DiaInicioPeriodo`, `MesInicialPeriodo` - Data inicial
- `DiaFinalPeriodo`, `MesFinalPeriodo` - Data final

### Formato de Dados

Todas as respostas são arrays JSON com campos em MAIÚSCULAS:

```json
[
  {
    "CODIGO": "1611.01.0.3.00.00.00",
    "DESCRICAO": "Receita de Exemplo",
    "PREVISTO": "1000.00",
    "ARRECADADO": "800.00"
  }
]
```

## Configuração

### BASE_URL

Configurado em `src/shared/constants.ts`:

```typescript
export const BASE_URL = "http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson";
```

### Empresas

Lista de empresas/entidades disponível em `src/shared/constants.ts`:

```typescript
export const companies = [
  { codigo: "1", descricao: "PREFEITURA MUNICIPAL" },
  { codigo: "2", descricao: "CÂMARA MUNICIPAL" },
  // ...
];
```

## Testes

### Executar Servidor

```bash
# Desenvolvimento com hot reload
bun run dev

# Produção
bun run start
```

### Testar com MCP Inspector

```bash
bun run inspector
```

Abre interface web para testar todas as ferramentas MCP.

## Boas Práticas

### 1. Use Bun APIs quando possível

```typescript
// ✅ CORRETO
const file = Bun.file("config.json");
const data = await file.json();

// ❌ ERRADO
import fs from "fs";
const data = JSON.parse(fs.readFileSync("config.json"));
```

### 2. Sempre valide com Zod

```typescript
// ✅ CORRETO
export const Schema = z.object({ campo: z.string() });
const validated = Schema.parse(input);

// ❌ ERRADO
function handler(input: any) {
  // Sem validação
}
```

### 3. Descrições detalhadas nos schemas

```typescript
// ✅ CORRETO
empresa: z.string().describe(
  "Código do setor/empresa (formato: '1', '2', etc.). Exemplo: '1'"
)

// ❌ ERRADO
empresa: z.string()
```

### 4. Tratamento de erros

```typescript
try {
  const result = await getData(input);
  return result ?? [];
} catch (error) {
  console.error("Erro:", error);
  return [];
}
```

## Dependências Principais

- **@modelcontextprotocol/sdk** - SDK oficial do MCP
- **katalist** - Cliente HTTP otimizado
- **zod** - Validação de schemas
- **bun** - Runtime JavaScript/TypeScript

## Links Úteis

- [Documentação do Bun](https://bun.sh/docs)
- [MCP Specification](https://modelcontextprotocol.io/)
- [Zod Documentation](https://zod.dev/)
- [Katalist](https://github.com/katalist-ai/katalist)


FIORILLI_BASE_URL=http://45.6.108.122:5656/transparencia/s