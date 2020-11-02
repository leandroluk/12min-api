import { IAddUserRepository } from '../../../../../data/protocols/add-user.repository'
import { IUserModel } from '../../../../../domain/models/user.model'
import { IAddUserModel } from '../../../../../domain/use-cases/add-user'
import env from '../../../../../main/config/env'
import { MongoHelper } from '../../helpers/mongo.helper'

export class MongoAddUserRepository implements IAddUserRepository {
  async addUser(userData: IAddUserModel): Promise<IUserModel> {
    const userCollection = MongoHelper.getCollection(env.mongo.collections.users)
    const data = {
      ...userData,
      createdAt: new Date()
    }
    const result = await userCollection.insertOne(data)
    const { password, ...resultWithoutPassword } = result.ops[0]
    return MongoHelper.map<IUserModel>(resultWithoutPassword)
  }
}
