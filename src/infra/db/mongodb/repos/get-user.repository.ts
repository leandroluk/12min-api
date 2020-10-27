import { IGetUserRepository } from '../../../../data/protocols/get-user.repository'
import { IUserModel } from '../../../../domain/models/user.model'
import { MongoHelper } from '../helpers/mongo.helper'

export class MongoGetUserRepository implements IGetUserRepository {
  async geUserByEmail(email: string): Promise<IUserModel> {
    const userCollection = MongoHelper.getCollection('users')
    const user = await userCollection.findOne({ email })

    if (user) {
      return MongoHelper.map<IUserModel>(user)
    }

    return null
  }
}
