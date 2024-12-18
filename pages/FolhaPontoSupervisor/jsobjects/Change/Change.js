export default {
  handleDropdownChange: async (selectedOption) => {
    storeValue("pontistaSelecionado", selectedOption);

    // Se "Todos" for selecionado, execute a query "FolhaPontoTodos"
    if (selectedOption === "todos") {
      await FolhaPontoTodos.run();
    } else {
      // Caso contrário, execute a query para o pontista selecionado
      await FolhaPonto.run({ id_pontista: selectedOption });
    }
  }
};
