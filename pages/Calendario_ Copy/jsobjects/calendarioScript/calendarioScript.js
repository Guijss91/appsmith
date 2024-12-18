export default {
  generateCalendar: function() {
    const daysInMonth = (month, year) => new Date(year, month, 0).getDate();
    const month = parseInt(DropdownMonth.selectedOptionValue) || new Date().getMonth() + 1;
    const year = parseInt(DropdownYear.selectedOptionValue) || new Date().getFullYear();
    
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const totalDays = daysInMonth(month, year);
    const calendarData = PresencaQuery.data;  // Dados da consulta SQL
    
    // Recuperar os feriados nacionais e manuais
    const feriadosNacionais = appsmith.store.feriadosNacionais || [];
    const feriadosLocais = FeriadosLocais.data || [];  // Query que busca os feriados locais

    let calendar = [];
    
    // Preencher os primeiros dias vazios até o primeiro dia real do mês
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendar.push({ day: '', status: '' });
    }
    
    // Gerar os dias do mês
    for (let i = 1; i <= totalDays; i++) {
      const day = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayOfWeek = new Date(year, month - 1, i).getDay();
      
      // Verificar se o dia é feriado (nacional ou manual)
      const feriadoNacional = feriadosNacionais.find(f => f.date === day);
      const feriadoLocal = feriadosLocais.find(f => f.data_feriado === day);
      
      let status = 'Ausente';
      let tooltip = '';

      if (feriadoNacional) {
        status = 'Feriado';
        tooltip = feriadoNacional.name;
      } else if (feriadoLocal) {
        status = 'Feriado';
        tooltip = feriadoLocal.descricao;  // Ajuste para garantir o nome do feriado manual
      } else if (dayOfWeek === 6 || dayOfWeek === 0) {  // Verifica se é fim de semana
        status = 'Fim de Semana';
      } else {
        // Verifica a presença no banco de dados
        const dayData = calendarData && calendarData.find(data => data.data_ponto === day);
        status = dayData ? dayData.status : 'Ausente';
      }
      
      // Adiciona o dia ao calendário
      calendar.push({ day: i, status: status, tooltip: tooltip });
    }
    
    // Preencher os slots restantes com dias vazios para completar a grade
    const totalSlots = Math.ceil((totalDays + firstDayOfMonth) / 7) * 7;
    for (let i = calendar.length; i < totalSlots; i++) {
      calendar.push({ day: '', status: '' });
    }

    console.log("Calendário gerado:", calendar);
    return calendar;
  },
  
  // Função para adicionar feriados locais
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
