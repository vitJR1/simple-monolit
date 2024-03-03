export interface OrderBy <Entity> {
	field: keyof Entity,
	by: 'ASC' | 'DESC'
}

export interface Pagination {
	skip: number,
	take: number
}

export class DefaultFilter <Entity> {
	order?: OrderBy<Entity>
	pagination?: Pagination
	search?: string
}
