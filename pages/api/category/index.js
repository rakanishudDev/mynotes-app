import nextConnect from 'next-connect';
import middleware from '../../../middlewares/database';

const handler = nextConnect()

handler.use(middleware)

handler.post(async (req, res) => {
    let data = JSON.parse(req.body)
    try {
        let category = await req.db.collection(data.uid).insertOne(
            {
                categoryId: data.categoryId,
                date: data.date,
                categoryName: data.categoryName,
                notes: []
            }
        )
        res.status(200).json({message: "all good"})
    } catch(err) {
        console.log(err)
        res.status(400).json({err})
    }
    
})

handler.delete(async (req,res) => {
    const data = req.body
    try {
        const deleteCategory = await req.db.collection(data.uid).deleteOne({categoryId: data.categoryId})
        res.status(200).json({message: "category ok"})
    } catch(err) {
        console.log(err)
        res.status(400).json(err)
    }
})

export default handler