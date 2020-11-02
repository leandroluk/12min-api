export interface IResultQuery<T = any> {
  offset: number
  limit: number
  total: number
  items: T[]
}
