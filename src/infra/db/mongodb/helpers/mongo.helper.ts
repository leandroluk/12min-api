import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,

  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect(): Promise<void> {
    this.client.disconnect()
  },

  getCollection(name: string): Collection {
    return (this.client as MongoClient).db().collection(name)
  },

  map<T>(doc: any): T {
    const { _id, ...rest } = doc
    return { ...rest, id: _id }
  }
}
