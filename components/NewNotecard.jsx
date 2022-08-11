import React, { useState } from 'react'
import styles from '../styles/Notecard.module.css'

const NewNotecard = ({uid, categoryId, setNewNoteFinished}) => {
  const [heading, setHeading] = useState('');
  const [text, setText] = useState('');
  /////
  const onChangeText = (e) => {
    setText(e.target.value)
  }
  const onChangeHeading = (e) => {
    setHeading(e.target.value)
  }
  /////
  const onCancel = () => {
    setNewNoteFinished()
  }
  /////
  const onSave = async () => {
    if (text === '' || heading === '') {
      return
    }
    const noteId = Date.now() + (Math.random() * 1000) + '';
    const note = {
      uid: uid,
      categoryId: categoryId,
      notes: {
        noteId: noteId,
        heading: heading,
        text: text
      }
    }
    
    try {
      const doc = await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify(note)
      })
      setNewNoteFinished(note.notes)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={styles.notesCard}>
        <div className={styles.topSector}>
          <input className={styles.headingInput} autoFocus type="text" placeholder="heading" onChange={onChangeHeading} value={heading} />
          <div className={styles.topSectorTools}>
            <img className="cursor-pointer" onClick={onCancel} height="20px" width="20px" src="/close.svg" alt="close" />
          </div>
        </div>
        <div className={styles.midSector}>
          <textarea value={text} onChange={onChangeText} spellCheck="false" className={`${styles.textarea}`} />
        </div>
        <div className={styles.bottomSector}>
          <button onClick={onSave} className={styles.saveButton} > <img height="20px" width="20px" src="/save.svg"/> Save</button>
        </div>
    </div>
  )
}

export default NewNotecard