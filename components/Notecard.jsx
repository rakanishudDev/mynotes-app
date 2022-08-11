import React, { useEffect, useState } from 'react'
import styles from '../styles/Notecard.module.css'

const Notecard = ({notes, uid, categoryId, onDelete}) => {
  const [editOn, setEditOn] = useState(false);
  const [heading, setHeading] = useState(notes.heading);

  const [text, setText] = useState(notes.text);
  const onEdit = () => {
    setEditOn(!editOn)
  }
  const onChangeText = (e) => {
    setText(e.target.value)
  }
  const onChangeHeading = (e) => {
    setHeading(e.target.value)
  }
  const onSave = async () => {
    if (text === '' || heading === '') {
      return
    }
    const updatedNote = {
      uid: uid,
      categoryId: categoryId,
      newNote: {
        noteId: notes.noteId,
        heading: heading,
        text: text
      }
    }
    setEditOn(false)
    try {
      const updatedDoc = await fetch("/api/notes", {
        method: "PUT",
        body: JSON.stringify(updatedNote)
      })
      setHeading(heading)
      setText(text)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className={styles.notesCard}>
        <div className={styles.topSector}>
          {editOn ? 
          <input className={styles.headingInput} autoFocus type="text" placeholder="heading" onChange={onChangeHeading} value={heading} /> 
          : 
          <p className={styles.heading}>{heading}</p>}
          <div className={styles.topSectorTools}>
            <img className="cursor-pointer" onClick={onEdit} height="20px" width="20px" src="/edit.svg" alt="edit" />
            <img className="cursor-pointer" onClick={() => onDelete(notes.noteId)} height="20px" width="20px" src="/close.svg" alt="close" />
          </div>
        </div>
        <div className={styles.midSector}>
          <textarea value={text} onChange={onChangeText} disabled={!editOn} spellCheck="false" className={`${styles.textarea} ${!editOn ? styles.textareaBorderNone : ''}`} />
        </div>
        {editOn && <div className={styles.bottomSector}>
        <button onClick={onSave} className={styles.saveButton} > <img height="20px" width="20px" src="/save.svg"/> Save</button>
        </div>}
    </div>
  )
}

export default Notecard