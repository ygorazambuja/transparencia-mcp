Dados Abertos
Portal Transparência Fiorilli
Despesas
Define Exercicio
GET
/VersaoJson/Despesas/?Listagem=DefineExercicio&ConectarExercicio={Exercicio}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Despesas/?Listagem=DefineExercicioConectarExercicio=2022
Despesas por Orgão
GET
/VersaoJson/Despesas/?Listagem=DespesasPorOrgao&DiaInicioPeriodo={diaInicio}&MesInicialPeriodo={MesInicio}&DiaFinalPeriodo={diaFinal}&MesFinalPeriodo={MesFinal}&Exercicio={Exercicio}&Empresa={Entidade}&MostraDadosConsolidado={MostrarDadosTodasEntidades}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Despesas/?Listagem=DespesasPorOrgao&DiaInicioPeriodo=01&MesInicialPeriodo=01&DiaFinalPeriodo=31&MesFinalPeriodo=12&Exercicio=2021&Empresa=1&MostraDadosConsolidado=False
Despesas por Unidade
GET
/VersaoJson/Despesas/?Listagem=DespesasPorUnidade&DiaInicioPeriodo={diaInicio}&MesInicialPeriodo={MesInicio}&DiaFinalPeriodo={diaFinal}&MesFinalPeriodo={MesFinal}&Exercicio={Exercicio}&Empresa={Entidade}&MostraDadosConsolidado={MostrarDadosTodasEntidades}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Despesas/?Listagem=DespesasPorUnidade&DiaInicioPeriodo=01&MesInicialPeriodo=01&DiaFinalPeriodo=31&MesFinalPeriodo=12&Exercicio=2021&Empresa=1&MostraDadosConsolidado=False
Despesas por Fornecedor
GET
/VersaoJson/Despesas/?Listagem=DespesasPorFornecedor&DiaInicioPeriodo={diaInicio}&MesInicialPeriodo={MesInicio}&DiaFinalPeriodo={diaFinal}&MesFinalPeriodo={MesFinal}&Exercicio={Exercicio}&Empresa={Entidade}&MostrarFornecedor={MostrarNomeFavorecido}&MostraDadosConsolidado={MostrarDadosTodasEntidades}&CNPJFornecedor={CNPJ de um Determinado Fornecedor (Opcional)}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Despesas/?Listagem=DespesasPorFornecedor&DiaInicioPeriodo=01&MesInicialPeriodo=01&DiaFinalPeriodo=31&MesFinalPeriodo=12&Exercicio=2021&Empresa=1&MostrarFornecedor=True&MostraDadosConsolidado=False
Despesas Gerais
GET
/VersaoJson/Despesas/?Listagem=DespesasGerais&DiaInicioPeriodo={diaInicio}&MesInicialPeriodo={MesInicio}&DiaFinalPeriodo={diaFinal}&MesFinalPeriodo={MesFinal}&Exercicio={Exercicio}&Empresa={Entidade}&MostrarFornecedor={MostrarNomeFavorecido}&MostraDadosConsolidado={MostrarDadosTodasEntidades}&UFParaFiltroCOVID={UFqueSeInformadaFiltraráEmpenhosCovid}&MostrarCNPJFornecedor={MostrarCNPJFornecedor}&ApenasIDEmpenho={ListarApenasOsCodigosEmpenho}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Despesas/?Listagem=DespesasGerais&DiaInicioPeriodo=01&MesInicialPeriodo=01&DiaFinalPeriodo=31&MesFinalPeriodo=12&Exercicio=2021&Empresa=1&MostrarFornecedor=True&MostraDadosConsolidado=False&UFParaFiltroCOVID=&MostrarCNPJFornecedor=True&ApenasIDEmpenho=False
Detalhe Empenho Por Número de Empenho
GET
/VersaoJson/Despesas/?Listagem=DetalhesEmpenhoPorNumeroEmpenho&intNumeroEmpenho={NumeroEmpenho}&strTipoEmpenho={TipoEmpenho}&Empresa={Entidade}&bolMostrarFornecedor={MostrarNomeFavorecido}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Despesas/?Listagem=DetalhesEmpenhoPorNumeroEmpenho&intNumeroEmpenho=1&strTipoEmpenho=OR&Empresa=1&bolMostrarFornecedor=False
Itens do Empenho Por Número de Empenho
GET
/VersaoJson/Despesas/?Listagem=ItensEmpenhoPorNumeroEmpenho&intNumeroEmpenho={NumeroEmpenho}&strTipoEmpenho={TipoEmpenho}&Empresa={Entidade}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Despesas/?Listagem=ItensEmpenhoPorNumeroEmpenho&intNumeroEmpenho=1&strTipoEmpenho=OR&Empresa=1
Despesas Empenhado Por Número de Empenho
GET
/VersaoJson/Despesas/?Listagem=EmpenhosDespesas_Empenhado_PorNumeroEmpenho&intNumeroEmpenho={NumeroEmpenho}&strTipoEmpenho={TipoEmpenho}&DiaInicioPeriodo={diaInicio}&MesInicialPeriodo={MesInicio}&DiaFinalPeriodo={DiaFinal}&MesFinalPeriodo={MesFinal}&Exercicio={Exercicio}&Empresa={Entidade}&IDButton={TipoListagem}&MostrarFornecedor={MostrarNomeFavorecido}&MostraDadosConsolidado={MostrarDadosTodasEntidades}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Despesas/?Listagem=EmpenhosDespesas_Empenhado_PorNumeroEmpenho&intNumeroEmpenho=1&strTipoEmpenho=OR&DiaInicioPeriodo=01&MesInicialPeriodo=01&DiaFinalPeriodo=31&MesFinalPeriodo=12&Exercicio=2022&Empresa=1&IDButton=lnkDespesasPor_NotaEmpenho&MostrarFornecedor=True&MostraDadosConsolidado=False
Despesas Liquidado Por Número de Empenho
GET
/VersaoJson/Despesas/?Listagem=EmpenhosDespesas_Liquidado_PorNumeroEmpenho&intNumeroEmpenho={NumeroEmpenho}&strTipoEmpenho={TipoEmpenho}&DiaInicioPeriodo={diaInicio}&MesInicialPeriodo={MesInicio}&DiaFinalPeriodo={DiaFinal}&MesFinalPeriodo={MesFinal}&Exercicio={Exercicio}&Empresa={Entidade}&IDButton={TipoListagem}&MostrarFornecedor={MostrarNomeFavorecido}&MostraDadosConsolidado={MostrarDadosTodasEntidades}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Despesas/?Listagem=EmpenhosDespesas_Liquidado_PorNumeroEmpenho&intNumeroEmpenho=1&strTipoEmpenho=OR&DiaInicioPeriodo=01&MesInicialPeriodo=01&DiaFinalPeriodo=31&MesFinalPeriodo=12&Exercicio=2022&Empresa=1&IDButton=lnkDespesasPor_NotaEmpenho&bolMostrarFornecedor=True&MostraDadosConsolidado=False
Despesas Pago Por Número de Empenho
GET
/VersaoJson/Despesas/?Listagem=EmpenhosDespesas_Pago_PorNumeroEmpenho&intNumeroEmpenho={NumeroEmpenho}&strTipoEmpenho={TipoEmpenho}&DiaInicioPeriodo={diaInicio}&MesInicialPeriodo={MesInicio}&DiaFinalPeriodo={DiaFinal}&MesFinalPeriodo={MesFinal}&Exercicio={Exercicio}&Empresa={Entidade}&IDButton={TipoListagem}&MostrarFornecedor={MostrarNomeFavorecido}&MostraDadosConsolidado={MostrarDadosTodasEntidades}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Despesas/?Listagem=EmpenhosDespesas_Pago_PorNumeroEmpenho&intNumeroEmpenho=1&strTipoEmpenho=OR&DiaInicioPeriodo=01&MesInicialPeriodo=01&DiaFinalPeriodo=31&MesFinalPeriodo=12&Exercicio=2022&Empresa=1&IDButton=lnkDespesasPor_NotaEmpenho&MostrarFornecedor=True&MostraDadosConsolidado=False
Despesas Pago com Número da Ordem de Pagamento Por Número de Empenho
GET
/VersaoJson/Despesas/?Listagem=Empenhos_Pago_ComOrdemPagto_PorNumeroEmpenho&intNumeroEmpenho={NumeroEmpenho}&strTipoEmpenho={TipoEmpenho}&Empresa={Entidade}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Despesas/?Listagem=Empenhos_Pago_ComOrdemPagto_PorNumeroEmpenho&intNumeroEmpenho=1&strTipoEmpenho=OR&Empresa=1
Ordem Pagto Detalhes Por Número de Empenho
GET
/VersaoJson/Despesas/?Listagem=OrdemPagto_Detalhes_PorNumeroEmpenho&intNumeroEmpenho={NumeroEmpenho}&strTipoEmpenho={TipoEmpenho}&Empresa={Entidade}&strNumeroPagto={NumeroPagto}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Despesas/?Listagem=OrdemPagto_Detalhes_PorNumeroEmpenho&intNumeroEmpenho=1&strTipoEmpenho=OR&Empresa=1&strNumeroPagto=1
Ordem Pagto Parcelas Por Número de Empenho
GET
/VersaoJson/Despesas/?Listagem=OrdemPagto_Parcelas_PorNumeroEmpenho&intNumeroEmpenho={NumeroEmpenho}&strTipoEmpenho={TipoEmpenho}&Empresa={Entidade}&strNumeroPagto={NumeroPagto}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Despesas/?Listagem=OrdemPagto_Parcelas_PorNumeroEmpenho&intNumeroEmpenho=1&strTipoEmpenho=OR&Empresa=1&strNumeroPagto=1
Ordem Pagto Cheques Por Número de Empenho
GET
/VersaoJson/Despesas/?Listagem=OrdemPagto_Cheques_PorNumeroEmpenho&intNumeroEmpenho={NumeroEmpenho}&strTipoEmpenho={TipoEmpenho}&Empresa={Entidade}&strNumeroPagto={NumeroPagto}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Despesas/?Listagem=OrdemPagto_Cheques_PorNumeroEmpenho&intNumeroEmpenho=1&strTipoEmpenho=OR&Empresa=1&strNumeroPagto=1
Notas Fiscais da Liquidação Por Número de Empenho
GET
/VersaoJson/Despesas/?Listagem=NotasEmpenhoLiquidacao_PorNumeroEmpenho&intNumeroEmpenho={NumeroEmpenho}&strTipoEmpenho={TipoEmpenho}&Empresa={Entidade}&strNumeroLiquidacao={NumeroLiquidacao}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Despesas/?Listagem=NotasEmpenhoLiquidacao_PorNumeroEmpenho&intNumeroEmpenho=1&strTipoEmpenho=OR&Empresa=1&strNumeroLiquidacao=1
Diárias
GET
/VersaoJson/Despesas/?Listagem=Diarias&DiaInicioPeriodo={diaInicio}&MesInicialPeriodo={MesInicio}&DiaFinalPeriodo={DiaFinal}&MesFinalPeriodo={MesFinal}&Exercicio={Exercicio}&Empresa={Entidade}&MostraDadosConsolidado={MostrarDadosTodasEntidades}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Despesas/?Listagem=Diarias&DiaInicioPeriodo=01&MesInicialPeriodo=01&DiaFinalPeriodo=31&MesFinalPeriodo=12&Exercicio=2022&Empresa=1&MostraDadosConsolidado=False
Despesas por Restos a Pagar
GET
/VersaoJson/Despesas/?Listagem=DespesasRestosPagar&DiaInicioPeriodo={diaInicio}&MesInicialPeriodo={MesInicio}&DiaFinalPeriodo={DiaFinal}&MesFinalPeriodo={MesFinal}&Exercicio={Exercicio}&Empresa={Entidade}&ApresentaNomeFavorecido={ApresentaNomeFavorecido}&MostraDadosConsolidado={MostrarDadosTodasEntidades}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/versaoJson/Despesas/?Listagem=DespesasRestosPagar&DiaInicioPeriodo=01&MesInicialPeriodo=01&DiaFinalPeriodo=31&MesFinalPeriodo=12&Exercicio=2023&Empresa=1&ApresentaNomeFavorecido=True&MostraDadosConsolidado=False
Despesas Extra Orçamentárias
GET
/VersaoJson/Despesas/?Listagem=DespesasExtraOrcamentaria&DiaInicioPeriodo={diaInicio}&MesInicialPeriodo={MesInicio}&DiaFinalPeriodo={DiaFinal}&MesFinalPeriodo={MesFinal}&Exercicio={Exercicio}&Empresa={Entidade}&ApresentaNomeFavorecido={ApresentaNomeFavorecido}&MostraDadosConsolidado={MostrarDadosTodasEntidades}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/versaoJson/Despesas/?Listagem=DespesasExtraOrcamentaria&DiaInicioPeriodo=01&MesInicialPeriodo=01&DiaFinalPeriodo=31&MesFinalPeriodo=12&Exercicio=2023&Empresa=1&ApresentaNomeFavorecido=True&MostraDadosConsolidado=False
Despesas por Exigibilidade (Ordem Cronológica)
GET
/VersaoJson/Despesas/?Listagem=DespesasporExigibilidade&DiaInicioPeriodo={diaInicio}&DiaFinalPeriodo={DiaFinal}&strTipoLista={TipoLista}&Empresa={Entidade}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/versaoJson/Despesas/?Listagem=DespesasporExigibilidade&DiaInicioPeriodo=01.01.2023&DiaFinalPeriodo=31.12.2023&strTipoLista=1&Empresa=1
Receitas
Define Exercício
GET
/VersaoJson/Receitas/?Listagem=DefineExercicio&ConectarExercicio={Exercicio}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Receitas/?Listagem=DefineExercicio&ConectarExercicio=2022
Receita Orçamentária
GET
/VersaoJson/Receitas/?Listagem=ReceitaOrcamentaria&DiaInicioPeriodo={diaInicio}&MesInicialPeriodo={MesInicio}&DiaFinalPeriodo={diaFinal}&MesFinalPeriodo={MesFinal}&Exercicio={Exercicio}&Empresa={Entidade}&MostraDadosConsolidado={MostrarDadosTodasEntidades}&CodigoReceita={Código da Receita (Opcional)}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Receitas/?Listagem=ReceitaOrcamentaria&DiaInicioPeriodo=01&MesInicialPeriodo=01&DiaFinalPeriodo=31&MesFinalPeriodo=12&Exercicio=2021&Empresa=1&MostraDadosConsolidado=False
Receita União
GET
/VersaoJson/Receitas/?Listagem=ReceitaUniao&DiaInicioPeriodo={diaInicio}&MesInicialPeriodo={MesInicio}&DiaFinalPeriodo={diaFinal}&MesFinalPeriodo={MesFinal}&Exercicio={Exercicio}&Empresa={Entidade}&MostraDadosConsolidado={MostrarDadosTodasEntidades}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Receitas/?Listagem=ReceitaUniao&DiaInicioPeriodo=01&MesInicialPeriodo=01&DiaFinalPeriodo=31&MesFinalPeriodo=12&Exercicio=2021&Empresa=1&MostraDadosConsolidado=False
Receita Estado
GET
/VersaoJson/Receitas/?Listagem=ReceitaEstado&DiaInicioPeriodo={diaInicio}&MesInicialPeriodo={MesInicio}&DiaFinalPeriodo={diaFinal}&MesFinalPeriodo={MesFinal}&Exercicio={Exercicio}&Empresa={Entidade}&MostraDadosConsolidado={MostrarDadosTodasEntidades}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Receitas/?Listagem=ReceitaEstado&DiaInicioPeriodo=01&MesInicialPeriodo=01&DiaFinalPeriodo=31&MesFinalPeriodo=12&Exercicio=2021&Empresa=1&MostraDadosConsolidado=False
Receita Extra Orçamentária
GET
/VersaoJson/Receitas/?Listagem=ReceitaExtraOrcamentaria&DiaInicioPeriodo={diaInicio}&MesInicialPeriodo={MesInicio}&DiaFinalPeriodo={diaFinal}&MesFinalPeriodo={MesFinal}&Exercicio={Exercicio}&Empresa={Entidade}&MostraDadosConsolidado={MostrarDadosTodasEntidades}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Receitas/?Listagem=ReceitaExtraOrcamentaria&DiaInicioPeriodo=01&MesInicialPeriodo=01&DiaFinalPeriodo=31&MesFinalPeriodo=12&Exercicio=2021&Empresa=1&MostraDadosConsolidado=False
Detalhes das Receitas Orçamentaria
GET
/VersaoJson/Receitas/?Listagem=DetalhesReceitaOrcamentaria&DiaInicioPeriodo={diaInicio}&MesInicialPeriodo={MesInicio}&DiaFinalPeriodo={diaFinal}&MesFinalPeriodo={MesFinal}&Exercicio={Exercicio}&Empresa={Entidade}&Codigochave={CodigoDaReceita}MostraDadosConsolidado={MostrarDadosTodasEntidades}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Receitas/?Listagem=DetalhesReceitaOrcamentaria&DiaInicioPeriodo=01&MesInicialPeriodo=01&DiaFinalPeriodo=15&MesFinalPeriodo=01&Exercicio=2023&Empresa=1&Codigochave=1112.50.0.1&MostraDadosConsolidado=False
Licitações e Contratos
Define Exercício
GET
/VersaoJson/LicitacoesEContratos/?Listagem=DefineExercicio&ConectarExercicio={Exercicio}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/LicitacoesEContratos/?Listagem=DefineExercicio&ConectarExercicio=2022
Licitações
GET
/VersaoJson/LicitacoesEContratos/?Listagem=Licitacoes&Exercicio={Exercicio}&Empresa={Entidade}&MostraDadosConsolidado={MostrarDadosTodasEntidades}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/LicitacoesEContratos/?Listagem=Licitacoes&Exercicio=2021&Empresa=1&MostraDadosConsolidado=False
Contratos
GET
/VersaoJson/LicitacoesEContratos/?Listagem=Contratos&Exercicio={Exercicio}&Empresa={Entidade}&MostraDadosConsolidado={MostrarDadosTodasEntidades}&ContratosApenasPublicados={MostrarApenasPublicados}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/LicitacoesEContratos/?Listagem=Contratos&Exercicio=2021&Empresa=1&MostraDadosConsolidado=False&ContratosApenasPublicados=False
Transferências
Define Exercício
GET
/VersaoJson/Transferencias/?Listagem=DefineExercicio&ConectarExercicio={Exercicio}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Transferencias/?Listagem=DefineExercicio&ConectarExercicio=2022
Transferências entre Entidades
GET
/VersaoJson/Transferencias/?Listagem=Transf&Empresa={Entidade}&MostraDadosConsolidado={MostrarDadosTodasEntidades}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Transferencias/?Listagem=Transf&Empresa=1&MostraDadosConsolidado=False
Pessoal
Define Exercício
GET
/VersaoJson/Transferencias/?Listagem=DefineExercicio&Empresa={Entidade}&MostraDadosConsolidado={MostrarDadosTodasEntidades}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Pessoal/?Listagem=DefineExercicio&ConectarExercicio=2023
Servidores
GET
/VersaoJson//Pessoal/?Listagem=Servidores&Empresa={Entidade}&Exercicio={Exercicio}&MesFinalPeriodo={MesFinal}
Ex: http://siteDaEntidade.uf.gov.br/Transparencia/VersaoJson/Pessoal/?Listagem=Servidores&Empresa=1&Exercicio=2023&MesFinalPeriodo=01