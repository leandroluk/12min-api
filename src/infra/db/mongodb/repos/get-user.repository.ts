import { IGetUserRepository } from '../../../../data/protocols/get-user.repository'
import { IUserModel } from '../../../../domain/models/user.model'
import env from '../../../../main/config/env'
import { MongoHelper } from '../helpers/mongo.helper'

export class MongoGetUserRepository implements IGetUserRepository {
  async getUser(userId: string): Promise<IUserModel> {
    const userCollection = MongoHelper.getCollection(env.mongo.collections.users)
    const _id = new MongoHelper.ObjectID(userId)
    const user = await userCollection.findOne({ _id })

    if (user) {
      const { password, ...restOfUser } = user
      return MongoHelper.map<IUserModel>(restOfUser)
    }

    return null
  }
}
