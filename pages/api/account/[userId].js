import nextConnect from 'next-connect'
import middlewareNextAuth from '../../../middlewares/userDatabase'
import { ObjectId } from 'mongodb';


const handler = nextConnect();
handler.use(middlewareNextAuth)

//GET USER CATEGORIES
handler.get(async (req, res) => {
    const userId = req.query.userId
    try {
        const user = await req.db.collection('users').find({_id: ObjectId(userId)}).toArray()
        if (user[0].categories) {
            res.status(200).json(user[0].categories)
        } else {
            res.status(400).json([])
        }
    }
    catch(err) {
        console.log(err)
        res.status(400).json({err})
    }
})

export default handler