export default {
  inicializarDropdown: async () => {
    // Executa a query para buscar os pontistas
    await GetPontista.run();

    // Define "Todos" como a opção selecionada por padrão
    storeValue("pontistaSelecionado", "todos"); // Define o valor inicial como "todos"
  }
};