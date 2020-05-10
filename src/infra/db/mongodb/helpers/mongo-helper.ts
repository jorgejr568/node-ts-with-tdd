import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  async connect (uri): Promise<void> {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.isConnected()) await this.connect()
    return new Promise(resolve => resolve(this.client.db().collection(name)))
  },

  map_IdtoId (collection: any): any {
    const { _id, ...collectionWithoutId } = collection
    return Object.assign(collectionWithoutId, { id: _id })
  }
}
