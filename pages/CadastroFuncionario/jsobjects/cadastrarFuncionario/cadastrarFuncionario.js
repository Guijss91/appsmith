export default {
  cadastrarFuncionario: async () => {
    try {
      const senhaHash = JSObject1.hashPassword(senhaInput.text);

      const usuario = await inserir_usuario.run({
        nome: nomeInput.text,
        email: emailInput.text,
        senha_hash: senhaHash,
        matricula: matriculaInput.text
      });
			
			const [usuarios] = usuario;

      if (usuario.length > 0) {
        const idUsuario = usuarios.id_usuario;

        const resultadoPontista = await inserir_pontista.run({
          id_usuario: idUsuario,
          supervisor: supervisor.selectedOptionValue,
          inicio_contrato: inicio_contrato.selectedDate,
          fim_contrato: fim_contrato.selectedDate,
          carga_horaria: cargahoraria.selectedOptionValue,
          turno: turno.selectedOptionValue,
          ferias_utilizadas: ferias_utilizadas.text
        });

        console.log("Resultado da Inserção de Pontista:", resultadoPontista);

        showAlert("Funcionário cadastrado com sucesso!", "success");
      } else {
        showAlert("Erro ao cadastrar usuário. Nenhum dado retornado.", "error");
      }
    } catch (error) {
      showAlert("Erro ao cadastrar funcionário. Por favor, tente novamente.", "error");
      console.error("Erro ao cadastrar funcionário:", error);
    }
  }
}