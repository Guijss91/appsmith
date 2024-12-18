export default {
	calcularFeriasDisponiveis: async function() {
		try {
			// Executa a query para obter as informações do pontista
			const resultado = await obterInformacoesPontista.run();
			if (resultado.length === 0) {
				throw new Error("Nenhuma informação do pontista encontrada.");
			}

			const pontista = resultado[0];

			// Obtendo a data de início do contrato e a data atual
			const inicioContrato = new Date(pontista.inicio_contrato);
			const dataAtual = new Date();

			// Calculando o número de meses trabalhados
			const anosTrabalhados = dataAtual.getFullYear() - inicioContrato.getFullYear();
			const mesesTrabalhados = dataAtual.getMonth() - inicioContrato.getMonth();
			const totalMesesTrabalhados = (anosTrabalhados * 12) + mesesTrabalhados;

			// Calculando o total de dias de férias adquiridos
			const diasFeriasAdquiridos = totalMesesTrabalhados * 2.5;

			// Calculando os dias de férias disponíveis
			const diasFeriasDisponiveis = diasFeriasAdquiridos - pontista.ferias_utilizadas;

			// Armazenando o resultado no Appsmith store
			storeValue("diasFeriasDisponiveis", diasFeriasDisponiveis);
		} catch (error) {
			showAlert("Erro ao calcular dias de férias disponíveis: " + error.message, "error");
			console.error(error);
		}
	}
}
