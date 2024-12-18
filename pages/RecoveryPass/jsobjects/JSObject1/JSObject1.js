export default {
    enviarLinkReset: async function() {
        var bcrypt = dcodeIO.bcrypt;
        const email = InputEmail.text;
        const fromEmail = "pontoljit@gmail.com";

        try {
            const resultado = await VerificarEmailQuery.run({ email });
            console.log("Resultado da verificação de e-mail:", resultado); // Log do resultado

            if (resultado.length > 0) {
                const userId = resultado[0].id_usuario;

                // Gerar token aleatório e hashá-lo com bcrypt
                const rawToken = Math.random().toString(36).substr(2) + new Date().getTime().toString(36);
                const hashedToken = await bcrypt.hash(rawToken, 10); // Gera o hash do token

                // Definir a data de expiração
                const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas a partir de agora

                // Armazenar o token no banco de dados
                const saveResult = await SaveTokenQuery.run({
                    userId: userId,
                    hashedToken: hashedToken, // Armazena o hashedToken
                    expirationDate: expirationDate
                });

                console.log("Resultado de SaveTokenQuery:", saveResult); // Log do resultado da inserção

                if (saveResult) {
                    // Criar o link de redefinição de senha
                    const resetLink = `https://appsmith.aidadpdf.cloud/app/untitled-application-2/newpasschange-66eb1629251d3244894a1d9c?token=${rawToken}`;

                    // Corpo do e-mail
                    const emailBody = `
                        <p>Olá,</p>
                        <p>Clique no link abaixo para redefinir sua senha:</p>
                        <p><a href="${resetLink}">${resetLink}</a></p>
                        <p>Este link é válido por 24 horas.</p>
                    `;

                    // Enviar o e-mail
                    await GmailSMTP.run({
                        to: email,
                        subject: "Redefinição de Senha",
                        body: emailBody,
                        from: fromEmail,
                        isHtml: true
                    });

                    showAlert("O link de redefinição de senha foi enviado para o seu e-mail.");
                } else {
                    showAlert("Erro ao salvar o token.");
                }
            } else {
                showAlert("E-mail não encontrado.");
            }
        } catch (error) {
            showAlert("Erro ao enviar o e-mail: " + error.message);
        }
    }
}
