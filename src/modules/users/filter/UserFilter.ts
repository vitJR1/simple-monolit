import { DefaultFilter } from '../../../utils/DefaultFilter'
import { User } from '../model/User'

export class UserFilter extends DefaultFilter<User> {
	id?: number
}
