export default {
  inicializarDropdown: async () => {
    // Executa a query para buscar os pontistas
    await GetPontista.run();
    
    // Verifica se há pontistas e define o primeiro como selecionado
    if (GetPontista.data && GetPontista.data.length > 0) {
      storeValue("pontistaSelecionado", GetPontista.data[0].id_pontista);
    }
  }
};
