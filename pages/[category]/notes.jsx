import { unstable_getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useState, useEffect } from 'react'
import Notecard from '../../components/Notecard'
import NewNotecard from '../../components/NewNotecard'
import { authOptions } from '../api/auth/[...nextauth]'
import styles from '../../styles/Notes.module.css'
import { useRouter } from 'next/router'


const Notes = ({data}) => {
  const {data: session, status} = useSession()
  const [myNotes, setMyNotes] = useState([])
  const [newNoteInProgress, setNewNoteInProgress] = useState(false)
  const router = useRouter()
  const categoryId = router.query.category

  const onDelete = async (noteId) => {
    const newNotes = myNotes.filter(note => note.noteId !== noteId)
    setMyNotes([...newNotes])
    try {
      const res = await fetch("/api/notes", {
        method: "DELETE",
        body: JSON.stringify({
          categoryId: categoryId,
          uid: session.user.id,
          noteId: noteId
        })
      })
    } catch (err) {
      console.log(err)
    }
  }

  const setNewNoteFinished = (note) => {
    if (!note) {
      setNewNoteInProgress(false)
      return
    }
    setNewNoteInProgress(false)
    myNotes.unshift(note)
    setMyNotes([...myNotes])
  }

  const onClickHandler = async () => {
    if (newNoteInProgress) {
      return
    }
    setNewNoteInProgress(true)
  }

  useEffect(() => {
    if (data) {
      setMyNotes([...data.notes])
    }
  }, [data])
  return (
    <div className={styles.pageContainer}>
      <div className={styles.topContainer}>
        <div className={styles.categoryNameBox}>
        <h2> {'< ' + data.categoryName + ' >'}</h2>
        </div>
        <div className={styles.createCategoryContainer}>
          <img onClick={onClickHandler} className={styles.addSvg} width="40px" height="40px" src="/add.svg" alt="add" />
          <h3>New Note</h3>
        </div>
      </div>
      <div className={styles.notecardsContainer}>
        {newNoteInProgress && (
          <NewNotecard setNewNoteFinished={setNewNoteFinished} categoryId={categoryId} uid={session.user.id} />
        )}
          {myNotes.map(note => {
              return <Notecard onDelete={onDelete} categoryId={categoryId} uid={session.user.id} notes={note} key={note.noteId} />
          })}
      </div>
    </div>
  )
}

export default Notes


export async function getServerSideProps(ctx) {
  const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions);
  const categoryName = ctx.query.category
  let data;
  if (session) {
    try {
      const res = await fetch(`https://mynotes-bay.vercel.app/api/notes/${session.user.id}/${categoryName}`)
      data = await res.json()
    } catch(err) {
      console.log(err)
    }
  }
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin?callbackUrl=https://mynotes-bay.vercel.app",
        permanent: false
      }
    }
  }
  return {
    props: {
      session: session,
      data: data && data
    }
  }
}