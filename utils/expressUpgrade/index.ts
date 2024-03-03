import { TokenPayload } from '../../src/utils/TokenPayload'

declare module 'express-serve-static-core' {
	export interface Request {
		user: TokenPayload
	}
}
