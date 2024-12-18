export default {
  verificarFaltasAutomaticas: async () => {
    const hoje = new Date().toISOString().slice(0, 10); // Data atual no formato YYYY-MM-DD
    const horaAtual = new Date().getHours();  // Obter a hora atual

    // Verifica se são pelo menos 18:30
    if (horaAtual < 18 || (horaAtual === 18 && new Date().getMinutes() < 30)) {
      console.log("Ainda não são 18:30, a verificação será feita após esse horário.");
      return;
    }

    // Consulta os pontistas
    const pontistas = await getPontistas.run(); // Suponha que essa query retorna uma lista de pontistas

    // Recuperar feriados e finais de semana
    const feriados = appsmith.store.feriadosNacionais || [];
    const diaSemana = new Date().getDay(); // 0 = Domingo, 6 = Sábado

    // Verifica se é fim de semana ou feriado
    if (diaSemana === 6 || diaSemana === 0 || feriados.find(f => f.date === hoje)) {
      console.log("Hoje é final de semana ou feriado. Nenhuma falta será registrada.");
      return;
    }

    // Verificar a falta para cada pontista
    for (let pontista of pontistas) {
      const registrosPonto = await getPontoDoDia.run({ id_pontista: pontista.id_pontista, data: hoje });

      if (!registrosPonto.length || registrosPonto.length === 1) {
        // Caso não tenha batido o ponto ou só tenha batido o ponto de entrada
        try {
          await registrarFalta.run({ id_pontista: pontista.id_pontista, data: hoje });
          console.log(`Falta registrada para o pontista ${pontista.nome}`);
        } catch (error) {
          console.error(`Erro ao registrar falta para o pontista ${pontista.nome}: ${error.message}`);
        }
      } else {
        console.log(`Pontista ${pontista.nome} está com o ponto completo.`);
      }
    }
  }
};
