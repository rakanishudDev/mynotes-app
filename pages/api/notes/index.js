import nextConnect from 'next-connect'
import middleware from '../../../middlewares/database'

const handler = nextConnect()

handler.use(middleware)

handler.post(async (req,res) => {
    const data = JSON.parse(req.body)
    try {
        let doc = await req.db.collection(data.uid).findOne({categoryId: data.categoryId})
        console.log(doc)
        const newNotes = [data.notes, ...doc.notes]
        const updatedDoc = await req.db.collection(data.uid).updateOne({categoryId: data.categoryId}, {
            $set: {
                notes: newNotes
            }
        })
        res.status(200).json({ok: true})
    } catch (err) {
        console.log(err)
        res.status(400).json({err})
    }

})

handler.put(async (req,res) => {
    const data = JSON.parse(req.body)
    try {
        const doc = await req.db.collection(data.uid).findOne({categoryId: data.categoryId})
        const updatedNotes = doc.notes
        for (let i = 0; i < updatedNotes.length; i++) {
            if (updatedNotes[i].noteId === data.newNote.noteId) {
                updatedNotes[i] = data.newNote
            }
        }
        const updateDoc = await req.db.collection(data.uid).updateOne({categoryId: data.categoryId}, {
            $set: {
                notes: updatedNotes
            }
        })
        res.json({ok: true})
    } catch(err) {
        console.log(err)
        res.status(200).json(err)
    }
})

handler.delete(async (req,res) => {
    const data = JSON.parse(req.body)
    try {
        const doc = await req.db.collection(data.uid).findOne({categoryId: data.categoryId})
        const updatedNotes = doc.notes.filter(note => note.noteId !== data.noteId);
        const updatedDoc = await req.db.collection(data.uid).updateOne({categoryId: data.categoryId}, {
            $set: {
                notes: updatedNotes
            }
        })
    } catch(err) {
        console.log(err)
        res.status(400).json(err)
    }
})

export default handler