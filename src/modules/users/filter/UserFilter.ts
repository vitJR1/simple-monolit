import { DefaultFilter } from '../../../utils/DefaultFilter'
import { User } from '../entity/User'

export class UserFilter extends DefaultFilter<User> {
	id?: number
}
