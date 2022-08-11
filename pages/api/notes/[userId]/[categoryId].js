import nextConnect from 'next-connect'
import middleware from '../../../../middlewares/database'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req,res) => {
    try {
        const doc = await req.db.collection(req.query.userId).findOne({categoryId: req.query.categoryId})
        res.json(doc)
    }catch(err) {
        console.log(err)
        res.status(400).json(err)
    }

})

export default handler