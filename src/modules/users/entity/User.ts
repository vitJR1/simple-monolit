import bcrypt from 'bcrypt'
import {BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('users')
export class User extends BaseEntity {

	@PrimaryGeneratedColumn()
	id?: number

	@Column({ type: 'varchar', length: 255 })
	name?: string

	@Column({ type: 'varchar', length: 255, update: false })
	email?: string

	@Column({ type: 'varchar', length: 255, select: false, update: false })
	password?: string

	@Column({ type: 'bigint', default: () => 'round(EXTRACT(epoch FROM now()))', update: false })
	created?: string

	@Column({ default: false })
	deleted?: boolean

	@BeforeInsert()
	@BeforeUpdate()
	encryptPassword(): void {
		if(this.password !== undefined) {
			this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10))
		}
	}

	validatePassword(password: string): boolean {
		if(this.password === undefined){
			throw Error('Password is undefined')
		}
		return bcrypt.compareSync(password , this.password)
	}
}
