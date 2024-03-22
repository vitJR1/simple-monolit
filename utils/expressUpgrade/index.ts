import { TokenPayload } from '../../src/utils/TokenPayload'
import {DataSource} from "typeorm";

declare module 'express-serve-static-core' {
	export interface Request {
		user: TokenPayload
		dataSource: DataSource
	}
}
