const tokenResult = await ValidateTokenQuery.run({ token: inputToken });

if (tokenResult.length > 0) {
	const token = tokenResult[0];
	const isExpired = new Date() > new Date(token.expiration_date);

	if (!isExpired) {
		// Token é válido, prossiga com a redefinição da senha
	} else {
		// Token expirado
	}
} else {
	// Token não encontrado
}
