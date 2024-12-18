export default {
  registrarEntrada: async () => {
    try {
      // Execute the query to register entry
      const result = await registrarHorarioEntrada.run();
      showAlert("Horário de entrada registrado com sucesso.", "success");
      console.log(result);
    } catch (error) {
      showAlert("Erro ao registrar horário de entrada. Por favor, tente novamente.", "error");
      console.error(error);
    }
  },
  registrarSaida: async () => {
    try {
      // Execute the query to register exit
      const result = await registrarHorarioSaida.run();
      showAlert("Horário de saída registrado com sucesso.", "success");
      console.log(result);
    } catch (error) {
      showAlert("Erro ao registrar horário de saída. Por favor, tente novamente.", "error");
      console.error(error);
    }
  }
}