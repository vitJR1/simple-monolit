import { User } from '../model/User'
import { UserFilter } from '../filter/UserFilter'
import logger from '../../../../utils/logger'
import { TokenPayload } from '../../../utils/TokenPayload'
import { TsoaResponse } from '@tsoa/runtime'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../../../../config'
import { plainToInstance } from 'class-transformer'

const users: User[] = []

export class UserHandler {
	async getUserById(id: number): Promise<User | null>  {
		return users.find(u => u.id === id) ?? null
	}

	async saveUser(user: User): Promise<User>  {
		user.id = users.length + 1
		user.deleted = false
		users.push(user)
		return user
	}

	async userList(filter: UserFilter): Promise<User[]>  {
		return users
			.filter(user => {
				return user.name.toUpperCase().includes((filter.search ?? '').toUpperCase()) && (filter.id === undefined || user.id === filter.id)
			})
			.sort((user1: User, user2: User): number => {
				if(filter.order !== undefined){
					return ((user1[filter.order.field] ?? 1) > (user2[filter.order.field] ?? 0) ? 1 : -1) * (filter.order.by === "ASC" ? 1 : -1)
				}
				return 1
			})
			.slice((filter.pagination?.skip ?? 0) * (filter.pagination?.take ?? 0), filter.pagination?.take ?? users.length)
	}

	async userRegistration (user: User): Promise<User> {
		const plainedUser = plainToInstance(User, user)
		plainedUser.id = users.length + 1
		plainedUser.deleted = false
		logger.debug(plainedUser.encryptPassword())
		users.push(plainedUser)
		console.log(users)
		return plainedUser
	}

	async userLogin (
		credentials: Pick<User, 'email' | 'password'>,
	  error: TsoaResponse<400, string>
	): Promise<string> {
		const user = users.find(user => user.email === credentials.email)
		if(user === undefined){
			throw error(400, 'User not found')
		}

		if(!user.validatePassword(credentials.password)){
			throw error(400, 'Incorrect login or password')
		}
		const payload: TokenPayload = {
			id: user.id!,
			scopes: ['get-user', 'mutate-user']
		}

		return jwt.sign(payload, SECRET_KEY)
	}
}
