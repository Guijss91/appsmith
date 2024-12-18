export default {
	autenticarUsuario: async function (login) {
		var bcrypt = dcodeIO.bcrypt;

		// Configurar os parâmetros para a consulta
		teste_login.params = {
			login: login,
		};

		try {
			// Executar a consulta
			var resultadoConsulta = await teste_login.run();

			// Verificar se há resultados
			if (resultadoConsulta && resultadoConsulta.length > 0) {
				// Obter os dados do usuário
				var usuario = resultadoConsulta[0];
				var senhaHash = usuario.senha_hash;

				// Comparar a senha fornecida com o hash armazenado
				var senhaValida = bcrypt.compareSync(senha.text, senhaHash);

				if (senhaValida) {
					var nomeUsuario = usuario.nome;

					// Armazenar o nome do usuário no Appsmith store
					storeValue("nomeUsuario", nomeUsuario);

					// Verificar se o usuário é pontista ou supervisor e redirecionar
					if (usuario.id_pontista) {
						storeValue("id_pontista", usuario.id_pontista);
						storeValue("matricula", usuario.matricula);
						navigateTo("HomePontista");
					} else if (usuario.id_supervisor) {
						storeValue("id_supervisor", usuario.id_supervisor);
						storeValue("matricula", usuario.matricula);
						navigateTo("HomeSupervisor");
					} else {
						// Caso o usuário não seja nem pontista nem supervisor
						showAlert("Tipo de usuário não reconhecido. Por favor, contate o suporte.", "error");
					}
				} else {
					// Senha inválida
					showAlert("Credenciais inválidas. Por favor, tente novamente.", "error");
				}
			} else {
				// Credenciais inválidas, exibir mensagem de erro
				showAlert("Credenciais inválidas. Por favor, tente novamente.", "error");
			}
		} catch (error) {
			// Exibir mensagem de erro em caso de falha na consulta
			showAlert("Erro ao verificar credenciais. Por favor, tente novamente.", "error");
			console.error("Erro ao verificar credenciais:", error);
		}
	}
};