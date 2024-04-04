import mongoose, { Connection } from 'mongoose'
import config from 'config'
import logger from './logger'
import { Pool, createPool } from 'generic-pool'
type MongooseConnection = Connection & { collection: (name: string) => any };
export default class MongoConn {
    mongoConn: mongoose.Connection
    private static _instance: MongoConn
    constructor() {
        this.connectDB()
        this.mongoConn = mongoose.connection
    }
    public static get instance() {
        return this._instance || ( this._instance = new this() )
    }
    public async connectDB() {
        mongoose.set('strictQuery', false)
        mongoose.set('bufferCommands', true)
        try {
            await mongoose.connect(
                `${config.get("mongodb.url")}/${config.get("mongodb.database")}`,
                config.get("mongodb.options"),
            )
            logger.info(
                `[MongoConn/connectDB]: Connected to database ${config.get("mongodb.database")}`
            )
        } catch( err ) {
            return logger.error(`[MongoConn/connectDB]: Error in database ${err}`)
        }
    }
    public pool(): Pool<MongooseConnection> {
        return createPool<MongooseConnection>({
            create: async () => {
                const connection = await mongoose.createConnection(`${config.get('mongodb.url')}/${config.get('mongodb.database')}`, config.get('mongodb.options'));
                return connection as unknown as MongooseConnection;
            },
            destroy: (client) => client.close(),
        }, {
            max: 10,
            min: 2
        })
    }
}