export default {
  carregarPontos: async () => {
    try {
      const opcaoSelecionada = Pontistas.selectedOptionValue;  // Obtém a opção selecionada no dropdown
      
      // Se a opção selecionada for "todos", execute a query de todos os pontos
      if (opcaoSelecionada === "todos") {
        const resposta = await FolhaPontoTodos.run();  // Executa a query para obter todos os pontos
        if (resposta) {
          storeValue("pontosPontistas", resposta);  // Armazena os dados dos pontos na store
        } else {
          console.error("Nenhum dado retornado da query 'FolhaPontoTodos'.");
        }
      } else {
        // Executa a query para um pontista específico
        const resposta = await FolhaPonto.run({ id_pontista: opcaoSelecionada });
        if (resposta) {
          storeValue("pontosPontistas", resposta);  // Armazena os dados do pontista selecionado na store
        } else {
          console.error(`Nenhum dado retornado para o pontista com ID ${opcaoSelecionada}.`);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar pontos:", error.message);
    }
  },

  inicializarDropdown: async () => {
    try {
      // Executa a query para buscar os pontistas
      await GetPontista.run();
      
      // Define a opção "Todos" como padrão e inicializa o dropdown
      if (GetPontista.data && GetPontista.data.length > 0) {
        storeValue("pontistaSelecionado", "todos");  // Define a opção "todos" como selecionada inicialmente
        await this.carregarPontos();  // Chama a função para carregar os pontos iniciais
      }
    } catch (error) {
      console.error("Erro ao inicializar dropdown:", error.message);
    }
  }
};
