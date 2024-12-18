export default {
  buscarHorarioBrasilia: async () => {
    try {
      const horario = await horarioAPI.run();
      
      if (horario && horario.datetime) {
        const horarioBrasilia = new Date(horario.datetime).toLocaleTimeString('pt-BR', { hour12: false });
        console.log("Horário de Brasília retornado da API:", horarioBrasilia);
        storeValue("horarioBrasilia", horarioBrasilia);  // Armazenar o horário no store
      } else {
        console.error("Nenhum horário retornado.");
      }
    } catch (error) {
      console.error("Erro ao buscar o horário de Brasília:", error);
    }
  }
};
