export default {
  calcularHorasDevidas: async () => {
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);
    const dataOntem = ontem.toISOString().slice(0, 10);

    const feriados = appsmith.store.feriadosNacionais || [];
    const diaSemanaOntem = ontem.getDay();

    // Não calcular se for fim de semana ou feriado
    if (diaSemanaOntem === 6 || diaSemanaOntem === 0 || feriados.find(f => f.date === dataOntem)) {
      console.log("Ontem foi final de semana ou feriado. Nenhuma hora devida será registrada.");
      return;
    }

    // Consulta os pontistas e suas cargas horárias diárias
    const pontistas = await getPontistas.run();

    for (let pontista of pontistas) {
      const registrosPonto = await getPontoDoDia.run({ id_pontista: pontista.id_pontista, data: dataOntem });

      const cargaHorariaDiaria = pontista.carga_horaria_diaria; // Carga horária da tabela zenite.pontista
      let minutosDevidos = 0;

      if (registrosPonto && registrosPonto.length > 0) {
        const horarioEntrada = registrosPonto[0].horario_entrada;
        const horarioSaida = registrosPonto[0].horario_saida;

        if (!horarioEntrada || !horarioSaida) {
          // Se não bateu ponto de entrada ou saída, deve toda a carga horária em minutos
          minutosDevidos = cargaHorariaDiaria * 60;
          console.log(`Pontista ${pontista.nome} não bateu ponto corretamente. Deve ${cargaHorariaDiaria} horas.`);
        } else {
          // Calcular a diferença entre horário de entrada e saída em minutos
          const entrada = new Date(`1970-01-01T${horarioEntrada}`);
          const saida = new Date(`1970-01-01T${horarioSaida}`);
          const minutosTrabalhados = (saida - entrada) / (1000 * 60); // Em minutos

          // Se trabalhou menos que a carga horária, calcular minutos devidos
          if (minutosTrabalhados < cargaHorariaDiaria * 60) {
            minutosDevidos = (cargaHorariaDiaria * 60) - minutosTrabalhados;
            console.log(`Pontista ${pontista.nome} trabalhou ${Math.floor(minutosTrabalhados / 60)} horas e ${minutosTrabalhados % 60} minutos. Deve ${Math.floor(minutosDevidos / 60)} horas e ${minutosDevidos % 60} minutos.`);
          } else {
            console.log(`Pontista ${pontista.nome} cumpriu a carga horária de ${cargaHorariaDiaria} horas.`);
          }
        }
      } else {
        // Se não há nenhum registro de ponto, deve toda a carga horária em minutos
        minutosDevidos = cargaHorariaDiaria * 60;
        console.log(`Pontista ${pontista.nome} não registrou nenhum ponto. Deve ${cargaHorariaDiaria} horas.`);
      }

      // Converter os minutos devidos para o formato 'HH:MM:SS' sem milissegundos
      const horas = Math.floor(minutosDevidos / 60);
      const minutos = Math.floor(minutosDevidos % 60);
      const segundos = Math.floor((minutosDevidos * 60) % 60);
      const horasDevidasFormatado = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

      // Registrar as horas devidas no banco
      if (minutosDevidos > 0) {
        await registrarHorasDevidas.run({
          id_pontista: pontista.id_pontista,
          data: dataOntem,
          horas_devidas: horasDevidasFormatado
        });
        console.log(`Pontista ${pontista.nome} deve ${horasDevidasFormatado} para o dia ${dataOntem}.`);
      }
    }
  }
};
