import { IAddUserRepository } from '../../../../data/protocols/add-user.repository'
import { IUserModel } from '../../../../domain/models/user.model'
import { IAddUserModel } from '../../../../domain/use-cases/add-user'
import { MongoHelper } from '../helpers/mongo.helper'

export class MongoAddUserRepository implements IAddUserRepository {
  async addUser(userData: IAddUserModel): Promise<IUserModel> {
    const userCollection = MongoHelper.getCollection('users')
    const data = {
      ...userData,
      createdAt: new Date()
    }
    const result = await userCollection.insertOne(data)
    return MongoHelper.map<IUserModel>(result.ops[0])
  }
}
