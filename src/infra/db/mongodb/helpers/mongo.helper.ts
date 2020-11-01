import { Collection, MongoClient, ObjectID } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  ObjectID,
  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect(): Promise<void> {
    await this.client.close()
  },

  getCollection(name: string): Collection {
    return (this.client as MongoClient).db().collection(name)
  },

  map<T>(doc: any): T {
    const { _id, ...rest } = doc
    return { ...rest, id: _id.toString() }
  }
}
