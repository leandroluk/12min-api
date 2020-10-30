import { IGetUserByEmailRepository } from '../../../../data/protocols/get-user-by-email.repository'
import { IUserModel } from '../../../../domain/models/user.model'
import env from '../../../../main/config/env'
import { MongoHelper } from '../helpers/mongo.helper'

export class MongoGetUserByEmailRepository implements IGetUserByEmailRepository {
  async geUserByEmail(email: string): Promise<IUserModel> {
    const userCollection = MongoHelper.getCollection(env.mongo.collections.users)
    const user = await userCollection.findOne({ email })

    if (user) {
      return MongoHelper.map<IUserModel>(user)
    }

    return null
  }
}
