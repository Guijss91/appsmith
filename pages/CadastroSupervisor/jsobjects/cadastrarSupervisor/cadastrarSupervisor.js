export default {
  cadastrarSupervisor: async () => {
    try {
      // Gerar o hash da senha
      const senhaHash = JSObject1.hashPassword(senhaInput.text);

      // Executar a query para inserir o usuário
      const usuario = await inserir_usuario.run({
        nome: nomeInput.text,
        email: emailInput.text,
        senha_hash: senhaHash,
        matricula: matriculaInput.text
      });
			
			const [usuarios] = usuario;

      // Verificar se a inserção do usuário foi bem-sucedida
      if (usuario.length > 0) {
        const idUsuario = usuarios.id_usuario;

        // Executar a query para inserir o supervisor
        const resultadoSupervisor = await inserir_supervisor.run({
          id_usuario: idUsuario
        });

        console.log("Resultado da Inserção de Supervisor:", resultadoSupervisor);

        showAlert("Supervisor cadastrado com sucesso!", "success");
      } else {
        showAlert("Erro ao cadastrar usuário. Nenhum dado retornado.", "error");
      }
    } catch (error) {
      showAlert("Erro ao cadastrar supervisor. Por favor, tente novamente.", "error");
      console.error("Erro ao cadastrar supervisor:", error);
    }
  }
}
