import { User } from '../entity/User'
import { UserFilter } from '../filter/UserFilter'
import { TokenPayload } from '../../../utils/TokenPayload'
import { TsoaResponse } from '@tsoa/runtime'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../../../../config'
import { plainToInstance } from 'class-transformer'
import {ILike} from "typeorm";
import {getPaginatedTable, PaginatedTable} from "../../common/PaginatedTable";

export class UserHandler {
	async getUserById(id: number): Promise<User | null>  {
		return await User.findOneBy({ id })
	}

	async saveUser(user: User): Promise<User>  {
		return await user.save().then(result => {
			result.password = undefined
			return result
		})
	}

	async userList(filter: UserFilter): Promise<PaginatedTable<User>>  {
		return await User.findAndCount({
			where: {
				name: ILike(`%${filter.search ?? ''}%`)
			},
			order: {
				[filter.order?.field ?? 'id']: filter.order?.by ?? 'DESC'
			},
			...filter.pagination,
		}).then(getPaginatedTable)
	}

	async userRegistration (user: User): Promise<User> {
		return await this.saveUser(user)
	}

	async userLogin (
		credentials: Pick<User, 'email' | 'password'>,
	  error: TsoaResponse<400, string>
	): Promise<string> {
		const user = await User.findOne({
			select: ['id', 'password'],
			where: { email: credentials.email }
		})
		if(user === null){
			throw error(400, 'User not found')
		}

		if(!user.validatePassword(credentials.password!)){
			throw error(400, 'Incorrect login or password')
		}
		const payload: TokenPayload = {
			id: user.id!,
			scopes: ['get-user', 'mutate-user']
		}

		return jwt.sign(payload, SECRET_KEY)
	}
}
