import { Body, Controller, Get, Path, Post, Queries, Res, Route, Security, Tags, Request } from 'tsoa'
import { UserHandler } from './handler/UserHandler'
import { User } from './model/User'
import { UserFilter } from './filter/UserFilter'
import { TsoaResponse } from '@tsoa/runtime'
import express from 'express'

@Route('users')
@Tags('Users')
export class UserController extends Controller{

	private readonly handler = new UserHandler()

	@Security('jwt')
	@Get('/me')
	async getUserById(
		@Request() req: express.Request
	): Promise<User | null> {
		return await this.handler.getUserById(req.user.id)
	}

	@Security('jwt', ['mutate-user'])
	@Post('/new')
	async saveUser(
		@Body() user: User
	): Promise<User> {
		return await this.handler.saveUser(user)
	}

	@Security('jwt', ['get-user'])
	@Post('')
	async userList(
		@Body() filter: UserFilter
	): Promise<User[] | User> {
		return await this.handler.userList(filter)
	}

	@Post('/reg')
	async userRegistration(
		@Body() user: User
	): Promise<User> {
		return await this.handler.userRegistration(user)
	}

	@Post('/login')
	async login(
		@Body() user: Pick<User, 'email' | 'password'>,
		@Res() error: TsoaResponse<400, string>
	): Promise<string> {
		return await this.handler.userLogin(user, error)
	}
}
