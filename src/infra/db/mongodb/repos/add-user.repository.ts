import { IAddUserRepository } from '../../../../data/protocols/add-user.repository'
import { IEncrypter } from '../../../../data/protocols/encrypter'
import { IUserModel } from '../../../../domain/models/user.model'
import { IAddUserModel } from '../../../../domain/use-cases/add-user'
import { MongoHelper } from '../helpers/mongo.helper'

export class MongoAddUserRepository implements IAddUserRepository {
  constructor(
    readonly encrypter: IEncrypter
  ) { }

  async addUser(userData: IAddUserModel): Promise<IUserModel> {
    const userCollection = MongoHelper.getCollection('users')
    const data = {
      ...userData,
      createdAt: new Date(),
      secret: await this.encrypter.encrypt(userData.email + userData.password)
    }
    const result = await userCollection.insertOne(data)
    return MongoHelper.map<IUserModel>(result.ops[0])
  }
}
