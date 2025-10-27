# Transparencia MCP Server

A Model Context Protocol (MCP) server for Brazilian public transparency data using the Fiorilli Portal API, built following MCP best practices.

## Overview

This MCP server provides tools for working with transparency data, including fetching data from public APIs and validating data against schemas. It follows the [MCP specification](https://modelcontextprotocol.io/) and implements proper logging practices (logging to stderr only).

## Features

### Fiorilli Transparency Portal API Integration

This server integrates with the Fiorilli Transparency Portal, a comprehensive Brazilian public transparency system. It provides access to various public data endpoints including:

#### Despesas (Expenses)
- `define_exercicio_despesas` - Define exercise year for expenses
- `despesas_por_orgao` - Expenses by department/organ
- `despesas_por_unidade` - Expenses by unit
- `despesas_por_fornecedor` - Expenses by supplier
- `despesas_gerais` - General expenses
- `detalhes_empenho_por_numero_empenho` - Commitment details by number
- `diarias` - Daily allowances
- `despesas_restos_pagar` - Outstanding balance expenses
- And many more expense-related endpoints...

#### Receitas (Revenue)
- `define_exercicio_receitas` - Define exercise year for revenue
- `receita_orcamentaria` - Budgetary revenue
- `receita_uniao` - Union revenue
- `receita_estado` - State revenue
- `receita_extra_orcamentaria` - Extra-budgetary revenue
- `detalhes_receita_orcamentaria` - Budgetary revenue details

#### Licitações e Contratos (Bids and Contracts)
- `licitacoes` - Bidding processes
- `contratos` - Contracts

#### Transferências (Transfers)
- `transferencias_entre_entidades` - Transfers between entities

#### Pessoal (Personnel)
- `servidores` - Employee/server data

### API Base URL Configuration

The server requires configuration of a Fiorilli Transparency Portal URL. You have several options:

#### Option 1: Environment Variable (Recommended)
```bash
# São Paulo
export FIORILLI_BASE_URL="http://transparencia.prefeitura.sp.gov.br"

# Rio de Janeiro
export FIORILLI_BASE_URL="http://riotransparente.rio.rj.gov.br"

# Minas Gerais
export FIORILLI_BASE_URL="http://www.transparencia.mg.gov.br"

# Then run:
bun run index.ts
```

#### Option 2: Configuration File
Edit `transparencia-config.json` and update the `baseUrl` field:
```json
{
  "baseUrl": "http://your-portal-domain.gov.br/Transparencia"
}
```

#### Option 3: Using npm Scripts
```bash
# Pre-configured examples
bun run dev        # São Paulo
bun run dev:rio    # Rio de Janeiro
bun run dev:mg     # Minas Gerais

# Mock mode for testing (no real API needed)
bun run mock       # Run server with fake data
bun run mock:inspector  # Run inspector with fake data
```

#### Option 4: Mock Mode for Development
For testing without a real Fiorilli portal, use mock mode:
```bash
export FIORILLI_MOCK_MODE=true
bun run index.ts
```
This provides realistic fake data for all endpoints, perfect for development and testing.

### Finding Fiorilli Portal URLs

To find transparency portals for specific states/cities:

1. **Search online**: "[State Name] transparência" or "[City Name] portal transparência"
2. **Verify the URL**: Must end with `/Transparencia` and serve JSON from `VersaoJson` endpoints
3. **Test the portal**: Visit `http://portal-url/Transparencia/VersaoJson/Despesas/?Listagem=DefineExercicio&ConectarExercicio=2023`

**Finding Working Fiorilli Portals:**

Some portals may be protected by anti-bot systems. To find working portals:

1. **Search for active Fiorilli installations**: Look for "portal transparência Fiorilli" + state name
2. **Test the portal**: Visit the URL and check if `/Transparencia/VersaoJson/` endpoints return JSON
3. **Check for anti-bot protection**: Some portals return HTML instead of JSON

**Known Working Examples:**
- Some state/city portals work without protection
- May need to find portals that don't use Cloudflare or similar systems
- Check local municipality portals which may have fewer restrictions

**Testing a Portal:**
```bash
# Test if a portal works
curl "http://portal-url/Transparencia/VersaoJson/Despesas/?Listagem=DefineExercicio&ConectarExercicio=2023"
# Should return JSON, not HTML
```

## Installation

```bash
bun install
```

## Usage

### Running the Server

```bash
bun run index.ts
```

The server uses STDIO transport and communicates with MCP clients like Claude Desktop.

### Connecting to Claude Desktop

1. Copy or symlink the `claude_desktop_config.json` to your Claude Desktop configuration directory:
   ```bash
   # On Linux/macOS
   mkdir -p ~/Library/Application\ Support/Claude
   cp claude_desktop_config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

2. Restart Claude Desktop

3. The server should appear in Claude's tools menu

## Development

### Project Structure

- `index.ts` - Main server implementation
- `http-schemas/` - Schema definitions for HTTP responses
- `claude_desktop_config.json` - Configuration for Claude Desktop

### Best Practices Implemented

- **Proper Logging**: All logging goes to stderr, never stdout (critical for STDIO-based MCP servers)
- **Error Handling**: Comprehensive error handling with appropriate MCP error codes
- **Type Safety**: Full TypeScript typing with proper interfaces
- **Modular Design**: Clean separation of concerns with dedicated handler methods

### Adding New Tools

To add new tools:

1. Define the tool in the `ListToolsRequestSchema` handler
2. Add a case in the `CallToolRequestSchema` handler
3. Implement the handler method with proper error handling

## Testing

### Basic Server Test

Test the server startup:

```bash
timeout 5 bun run index.ts
```

You should see:
```
[INFO] Starting Transparencia MCP Server
[INFO] Server connected and ready to handle requests
```

### Interactive Testing with MCP Inspector

The MCP Inspector provides a web-based interface for testing your MCP server without needing Claude Desktop.

#### Quick Start

```bash
# Using npm script (recommended)
bun run inspector

# Or using the shell script
./test-inspector.sh

# Or directly with npx
npx @modelcontextprotocol/inspector bun run index.ts
```

#### What to Expect

1. The inspector will start a web server and open your browser
2. You'll see a URL like: `http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=<token>`
3. The web interface provides:
   - **Tools Tab**: Test all Fiorilli API tools (expenses, revenue, bids, contracts, etc.)
   - **Server Connection Pane**: Monitor server status
   - **Notifications Pane**: View server logs and messages

#### Using the Inspector

1. **Test Tools**: Click on the "Tools" tab
2. **Select a Tool**: Choose any Fiorilli API tool (e.g., `despesas_por_orgao`)
3. **Enter Parameters**: Fill in the required arguments based on the tool schema
4. **Execute**: Click the execute button to test the tool
5. **View Results**: See the response in the results panel

### Example Fiorilli API Tool Tests

#### Expenses by Department
```json
{
  "diaInicio": "01",
  "mesInicio": "01",
  "diaFinal": "31",
  "mesFinal": "12",
  "exercicio": "2023",
  "empresa": "1",
  "mostraDadosConsolidado": false
}
```

#### Revenue Data
```json
{
  "diaInicio": "01",
  "mesInicio": "01",
  "diaFinal": "31",
  "mesFinal": "12",
  "exercicio": "2023",
  "empresa": "1",
  "mostraDadosConsolidado": false
}
```

#### Commitment Details
```json
{
  "numeroEmpenho": "12345",
  "tipoEmpenho": "OR",
  "empresa": "1",
  "bolMostrarFornecedor": true
}
```

#### Employee Data
```json
{
  "empresa": "1",
  "exercicio": "2023",
  "mesFinalPeriodo": "12"
}
```

### Real API Usage

To use with real Fiorilli portals, update the BASE_URL in `src/pedrogomes/functions.ts`:

```typescript
const BASE_URL = "http://seusite.seuestado.gov.br/Transparencia";
```

Replace `seusite.seuestado.gov.br` with the actual transparency portal domain for your state/entity.

## Built with

- [Model Context Protocol SDK](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
- [Bun](https://bun.com) - Fast JavaScript runtime
- TypeScript for type safety
