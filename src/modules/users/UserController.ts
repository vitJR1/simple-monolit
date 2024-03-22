import { Body, Controller, Get, Path, Post, Queries, Res, Route, Security, Tags, Request } from 'tsoa'
import { UserHandler } from './handler/UserHandler'
import { User } from './entity/User'
import { UserFilter } from './filter/UserFilter'
import { TsoaResponse } from '@tsoa/runtime'
import express from 'express'
import {plainToInstance} from "class-transformer";
import {PaginatedTable} from "../common/PaginatedTable";

@Route('users')
@Tags('Users')
export class UserController extends Controller {

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
		@Body() user: Pick<User, 'id' | 'name' | 'email' | 'password' | 'deleted'>
	): Promise<User> {
		return await this.handler.saveUser(plainToInstance(User, user))
	}

	@Security('jwt', ['get-user'])
	@Post('')
	async userList(
		@Body() filter: UserFilter
	): Promise<PaginatedTable<User>> {
		return await this.handler.userList(filter)
	}

	@Post('/reg')
	async userRegistration(
		@Body() user: Pick<User, 'name' | 'email' | 'password'>
	): Promise<User> {
		return await this.handler.userRegistration(plainToInstance(User, user))
	}

	@Post('/login')
	async login(
		@Body() user: Pick<User, 'email' | 'password'>,
		@Res() error: TsoaResponse<400, string>
	): Promise<string> {
		return await this.handler.userLogin(user, error)
	}
}
