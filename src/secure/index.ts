import * as express from "express"
import * as jwt from "jsonwebtoken"
import { SECRET_KEY } from '../../config'

export function expressAuthentication(
	request: express.Request,
	securityName: string,
	scopes?: string[]
): Promise<any> {
	switch (securityName) {
		case "api_key":
			return apiKeyHandler(request, scopes)
		case "jwt":
			return jwtHandler(request, scopes)
		default:
			throw Error('Authorization handler for this method is not presented')
	}
}

const apiKeyHandler = async ( request: express.Request, scopes: string[] | undefined ) => {
	let token;
	if (request.query && request.query.access_token) {
		token = request.query.access_token;
	}

	return token === 'secret_app_key' ? Promise.resolve(true) : Promise.reject('Incorrect ket received')
}

const jwtHandler = async (request: express.Request, scopes: string[] | undefined) => {
	const token =
		request.body.token ||
		request.query.token ||
		request.headers["authorization"] ||
		request.headers["Authorization"] ||
		request.headers["x-access-token"];

	return new Promise((resolve, reject) => {
		if (!token) {
			reject(new Error("No token provided"));
		}
		jwt.verify(token, SECRET_KEY, function (err: any, decoded: any) {
			if (err) {
				reject(err);
			} else {
				for (let scope of scopes ?? []) {
					if (!decoded.scopes.includes(scope)) {
						reject(new Error("JWT does not contain required scope."));
					}
				}
				resolve(decoded);
			}
		});
	});
}
