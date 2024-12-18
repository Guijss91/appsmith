export default {
	// Função para salvar feriado personalizado
	saveHoliday: function(date) {
		let holidays = appsmith.store.customHolidays || [];
		if (!Array.isArray(holidays)) {
			holidays = [];
		}
		// Adiciona a data selecionada se não estiver já na lista
		if (!holidays.some(h => h.date === date)) {
			holidays.push({ date: date });
			storeValue('customHolidays', holidays); // Atualiza o Appsmith Store
			// Atualiza o calendário após adicionar
			this.refreshCalendar();
		}
	},

	// Função para atualizar o calendário
	refreshCalendar: function() {
		this.generateCalendar(); // Atualiza o calendário
	},

	// Função para gerar o calendário
	generateCalendar: function() {
		const daysInMonth = (month, year) => new Date(year, month, 0).getDate();
		const month = parseInt(DropdownMonth.selectedOptionValue) || new Date().getMonth() + 1;
		const year = parseInt(DropdownYear.selectedOptionValue) || new Date().getFullYear();

		const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
		const totalDays = daysInMonth(month, year);
		const holidays = this.getHolidays(year); // Obtém todos os feriados

		let calendar = [];

		// Preencher os dias antes do início do mês com vazios
		for (let i = 0; i < firstDayOfMonth; i++) {
			calendar.push({ day: '', status: '' });
		}

		for (let i = 1; i <= totalDays; i++) {
			const day = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
			const status = holidays.includes(day) ? 'Feriado' : 'Disponível';
			const isWeekend = [0, 6].includes((firstDayOfMonth + i - 1) % 7); // 0 é Domingo, 6 é Sábado

			calendar.push({
				day: i,
				status: status,
				isWeekend: isWeekend
			});
		}

		// Preencher os dias após o final do mês com vazios para completar a última semana
		const totalSlots = Math.ceil((totalDays + firstDayOfMonth) / 7) * 7;
		for (let i = calendar.length; i < totalSlots; i++) {
			calendar.push({ day: '', status: '' });
		}

		return calendar;
	},

	// Função para obter todos os feriados, incluindo personalizados
	getHolidays: function(year) {
		// Feriados Nacionais
		const nationalHolidays = [
			`${year}-01-01`, // Ano Novo
			`${year}-02-12`, // Carnaval
			`${year}-02-13`, // Carnaval
			`${year}-03-29`, // Sexta-feira Santa
			`${year}-04-21`, // Tiradentes
			`${year}-05-01`, // Dia do Trabalhador
			`${year}-06-20`, // Corpus Christi
			`${year}-09-07`, // Independência do Brasil
			`${year}-10-12`, // Nossa Senhora Aparecida
			`${year}-11-01`, // Todos os Santos
			`${year}-11-15`, // Proclamação da República
			`${year}-12-02`, // Finados
			`${year}-12-25`  // Natal
		];

		// Adicionar feriados personalizados
		const customHolidays = appsmith.store.customHolidays || [];
		return [...nationalHolidays, ...customHolidays.map(h => h.date)];
	}
};
