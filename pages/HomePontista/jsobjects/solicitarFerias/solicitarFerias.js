export default {
  solicitarFerias: async function() {
    try {
      // Obtendo as datas selecionadas
      const dataInicio = moment(DatePickerInicio.selectedDate).format("YYYY-MM-DD");
      const dataFim = moment(DatePickerFim.selectedDate).format("YYYY-MM-DD");

      // Verificando se a data de início é anterior à data de fim
      if (moment(dataInicio).isBefore(dataFim)) {
        // Armazenando as datas formatadas
        storeValue("dataInicio", dataInicio);
        storeValue("dataFim", dataFim);

        // Execute a query para inserir a solicitação de férias
        const resultado = await inserirSolicitacaoFerias.run();
        
        // Verifica se a query retornou algum resultado
        if (resultado && resultado.length > 0) {
          showAlert("Solicitação de férias enviada com sucesso.", "success");
        } else {
          throw new Error("Erro ao enviar solicitação de férias.");
        }
      } else {
        showAlert("A data de início deve ser anterior à data de fim.", "error");
      }
    } catch (error) {
      showAlert("Erro ao enviar solicitação de férias: " + error.message, "error");
      console.error(error);
    }
  }
}
