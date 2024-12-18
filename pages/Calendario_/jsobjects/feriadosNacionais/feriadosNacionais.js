export default {
  buscarFeriados: async () => {
    try {
      const ano = new Date().getFullYear();
      const feriados = await feriadosAPI.run({ ano });

      if (feriados) {
        console.log("Feriados retornados da API:", feriados);
        storeValue("feriadosNacionais", feriados);  // Armazenar os feriados no store
      } else {
        console.error("Nenhum feriado retornado.");
      }
    } catch (error) {
      console.error("Erro ao buscar feriados:", error);
    }
  }
};

