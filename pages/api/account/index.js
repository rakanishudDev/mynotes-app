import middlewareNextAuth from '../../../middlewares/userDatabase'
import nextConnect from "next-connect";
import { ObjectId } from 'mongodb';


const handler = nextConnect()
handler.use(middlewareNextAuth)

// SAVE USER CATEGORY
handler.post(async (req,res) => {
    const data = JSON.parse(req.body)
    try {
        const user = await req.db.collection('users').find({_id: ObjectId(data.uid)}).toArray()
        let newCategories = []
        if(user[0].categories) {
            newCategories = user[0].categories
        }
        newCategories.unshift({categoryName: data.categoryName, categoryId: data.categoryId})
        const updatedUser = await req.db.collection('users').updateOne({_id: ObjectId(data.uid)}, {
            $set: {categories: newCategories}
        })
        res.status(200).json({data: user})
    } catch (err) {
        console.log(err)
        res.status(400).json([err])
    }
})

handler.delete(async (req,res) => {
    const data = req.body
    try {
        const user = await req.db.collection("users").findOne({_id: ObjectId(data.uid)})
        const newCategories = user.categories.filter(category => category.categoryId !== data.categoryId)
        const deleteCategory = await req.db.collection("users").updateOne({_id: ObjectId(data.uid)}, {
            $set: {
                categories: newCategories
            }
        })
        res.status(200).json({message: "account ok"})
    } catch (err) {
        console.log(err)
        res.status(400).json({err})
    }
})

export default handler


