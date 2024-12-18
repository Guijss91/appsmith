export default {
  adicionarFeriado: async () => {
    try {
      const resultado = await inserirFeriado.run();  // Insere feriado manual no banco
      if (resultado) {
        showAlert('Feriado adicionado com sucesso!', 'success');
        await FeriadosLocais.run();  // Atualiza a lista de feriados manuais
      } else {
        showAlert('Erro ao adicionar feriado.', 'error');
      }
    } catch (error) {
      showAlert('Erro ao adicionar feriado: ' + error.message, 'error');
    }
  },

  // Função para remover feriados locais
  removerFeriado: async () => {
    const idFeriado = DropdownFeriado.selectedOptionValue;  // Obtém o ID do feriado selecionado
    if (!idFeriado) {
      showAlert('Por favor, selecione um feriado para remover.', 'warning');
      return;
    }
    
    try {
      await removerFeriado.run({ id_feriado: idFeriado });  // Remove feriado do banco
      showAlert('Feriado removido com sucesso!', 'success');
      await FeriadosLocais.run();  // Atualiza a lista de feriados manuais
    } catch (error) {
      showAlert('Erro ao remover feriado: ' + error.message, 'error');
    }
  }
};