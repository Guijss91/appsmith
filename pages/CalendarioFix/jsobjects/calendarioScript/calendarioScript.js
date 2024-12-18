export default {
	generateCalendar: function() {
		const daysInMonth = (month, year) => new Date(year, month, 0).getDate();
		const month = parseInt(DropdownMonth.selectedOptionValue) || new Date().getMonth() + 1;
		const year = parseInt(DropdownYear.selectedOptionValue) || new Date().getFullYear();

		const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
		const totalDays = daysInMonth(month, year);
		const calendarData = PresencaQuery.data;

		let calendar = [];

		// Preencher os dias antes do início do mês com vazios
		for (let i = 0; i < firstDayOfMonth; i++) {
			calendar.push({ day: '', status: '' });
		}

		for (let i = 1; i <= totalDays; i++) {
			const day = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
			const dayOfWeek = new Date(day).getDay(); // 0 é domingo, 6 é sábado

			let status;

			if (dayOfWeek === 6 || dayOfWeek === 5) {
				// Marcar sábados e domingos como "Fim de Semana"
				status = 'Fim de Semana';
			} else {
				const dayData = calendarData && calendarData.find(data => data.data_ponto === day);
				status = dayData ? dayData.status : 'Ausente';
			}

			calendar.push({
				day: i,
				status: status
			});
		}

		// Preencher os dias após o final do mês com vazios para completar a última semana
		const totalSlots = Math.ceil((totalDays + firstDayOfMonth) / 7) * 7;
		for (let i = calendar.length; i < totalSlots; i++) {
			calendar.push({ day: '', status: '' });
		}

		return calendar;
	}
}
