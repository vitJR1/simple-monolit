export class TableInfo {
  count!: number
}

export class PaginatedTable <Items, Info = TableInfo> {
  items!: Items[]
  info!: Info
}

export const getPaginatedTable = <Items> (result: [Items[], number]): PaginatedTable<Items> => ({
  items: result[0],
  info: {
    count: result[1]
  }
})
