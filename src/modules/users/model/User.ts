import bcrypt from 'bcrypt'

export class User {

	id?: number

	name!: string

	email!: string

	password!: string

	deleted?: boolean

	encryptPassword(): string {
		this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10))
		return this.password
	}

	validatePassword(password: string): boolean {
		return bcrypt.compareSync(password , this.password)
	}
}
