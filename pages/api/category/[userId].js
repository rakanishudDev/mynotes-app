
import nextConnect from 'next-connect';
import middleware from '../../../middlewares/database';

const handler = nextConnect()

handler.use(middleware)


// GET user category with notes
handler.get(async (req, res) => {
    try {
        let categories = await req.db.collection(req.query.userId).find({category: "javascript"}).toArray()
        res.status(200).json({asd: categories})
    } catch(err) {
        console.log(err)
        res.status(400).json({err})
    }
    
})

export default handler