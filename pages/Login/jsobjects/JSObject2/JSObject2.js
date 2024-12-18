export default {
  verificarFaltasAutomaticas: async () => {
    // Obtém a data do dia anterior
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    const dataOntem = ontem.toISOString().slice(0, 10); // Formato YYYY-MM-DD

    // Consulta os pontistas
    const pontistas = await getPontistas.run(); // Query que busca os pontistas

    // Recuperar feriados e fins de semana
    const feriados = appsmith.store.feriadosNacionais || [];
    const diaSemana = ontem.getDay(); // 0 = Domingo, 6 = Sábado

    if (diaSemana === 6 || diaSemana === 0 || feriados.find(f => f.date === dataOntem)) {
      console.log("Ontem foi final de semana ou feriado. Nenhuma falta será registrada.");
      return;
    }

    // Verificar a falta para cada pontista
    for (let pontista of pontistas) {
      const registrosPonto = await getPontoDoDia.run({ id_pontista: pontista.id, data: dataOntem });

      if (registrosPonto.length > 0) {
        const registro = registrosPonto[0]; // Pega o primeiro (e único) registro do dia

        // Verifica se o horário de entrada e saída estão registrados
        if (!registro.horario_entrada || !registro.horario_saida) {
          try {
            await registrarFalta.run({ id_pontista: pontista.id, data: dataOntem });
            console.log(`Falta registrada para o pontista ${pontista.nome} no dia ${dataOntem}`);
          } catch (error) {
            console.error(`Erro ao registrar falta para o pontista ${pontista.nome}: ${error.message}`);
          }
        } else {
          console.log(`Pontista ${pontista.nome} bateu o ponto corretamente no dia ${dataOntem}.`);
        }
      } else {
        // Caso não tenha nenhum registro de ponto
        try {
          await registrarFalta.run({ id_pontista: pontista.id, data: dataOntem });
          console.log(`Falta registrada para o pontista ${pontista.nome} no dia ${dataOntem}`);
        } catch (error) {
          console.error(`Erro ao registrar falta para o pontista ${pontista.nome}: ${error.message}`);
        }
      }
    }
  }
};
