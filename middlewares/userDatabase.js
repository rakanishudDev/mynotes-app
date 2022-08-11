import {MongoClient} from 'mongodb';
import nextConnect from "next-connect";

const name = process.env.DB_USER
const pass = process.env.DB_PASSWORD
const client = new MongoClient(`mongodb+srv://${name}:${pass}@next-auth-cluster.xistraz.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

async function database(req,res,next) {
    await client.connect()
    req.dbClient = client;
    req.db = client.db('Next-Auth')
    return next()
}

const middlewareNextAuth = nextConnect()
middlewareNextAuth.use(database)

export default middlewareNextAuth