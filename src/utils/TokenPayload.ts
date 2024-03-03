type TokenScopes = 'get-user' | 'mutate-user'

export interface TokenPayload {
	id: number
	scopes: TokenScopes[]
}
