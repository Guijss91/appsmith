export default {
	getCurrentMonth: function() {
		const date = new Date();
		return date.getMonth() + 1; // getMonth() retorna um valor de 0 a 11, então somamos 1
	},

	setDefaultMonth: function() {
		const currentMonth = this.getCurrentMonth();
		return currentMonth;
	},

	getCurrentYear: function() {
		const date = new Date();
		return date.getFullYear();
	},

	setDefaultYear: function() {
		const currentYear = this.getCurrentYear();
		return currentYear;
	}
}
