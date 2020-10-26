import { IUserModel } from '../../domain/models/user.model'
import { IAddUserModel } from '../../domain/use-cases/add-user'

export interface IAddUserRepository {
  addUser(user: IAddUserModel): Promise<IUserModel>
}
