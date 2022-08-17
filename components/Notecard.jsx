import React, { useEffect, useState } from 'react'
import styles from '../styles/Notecard.module.css'
import OpenedNotecard from './OpenedNotecard';

const Notecard = ({notes, uid, categoryId, onDelete}) => {
  const [editOn, setEditOn] = useState(false);
  const [heading, setHeading] = useState(notes.heading);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isRemove, setIsRemove] = useState(false);

  const [text, setText] = useState(notes.text);
  const onEdit = () => {
    setIsRemove(false)
    setEditOn(!editOn)
  }
  const onRemove = () => {
    setEditOn(false)
    setIsRemove(!isRemove)
  }

  const onChangeText = (e) => {
    setText(e.target.value)
  }
  const onChangeHeading = (e) => {
    setHeading(e.target.value)
  }
  const onSave = async (openedNote) => {
    console.log('edited')
    if (text === '' || heading === '') {
      return
    }
    const updatedNote = {
      uid: uid,
      categoryId: categoryId,
      newNote: {
        noteId: notes.noteId,
        heading: openedNote ? openedNote.heading : heading,
        text: openedNote ? openedNote.text : text
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

  const openNote = () => {
    setIsNoteOpen(true)

  }
  const closeNotecard = (e) => {
    if (e.target.id === "closingBg")
    setIsNoteOpen(false)
  }
  const onDeleteOpened = () => {
    onDelete(notes.noteId)
    setIsNoteOpen(false)
  }

  return (
    <div className={styles.notesCard}>
      {isNoteOpen && <OpenedNotecard onDeleteOpened={onDeleteOpened} onSave={onSave} closeNotecard={closeNotecard} notes={notes} />}
      <div className={styles.topSector}>
        {editOn ? 
        <input className={styles.headingInput} autoFocus type="text" placeholder="heading" onChange={onChangeHeading} value={heading} /> 
        : 
        <p onClick={openNote} className={styles.heading}>{heading}</p>}
        <div className={styles.topSectorTools}>
          <img className="cursor-pointer" onClick={onEdit} height="20px" width="20px" src="/edit.svg" alt="edit" />
          <img className="cursor-pointer" onClick={onRemove} height="20px" width="20px" src="/close.svg" alt="close" />
        </div>
      </div>
      <div className={styles.midSector}>
        <textarea value={text} onChange={onChangeText} disabled={!editOn} spellCheck="false" className={`${styles.textarea} ${!editOn ? styles.textareaBorderNone : ''}`} />
      </div>
      {editOn && <div className={styles.bottomSector}>
      <button onClick={onSave} className={styles.saveButton} > <img height="20px" width="20px" src="/save.svg"/> Save</button>
      </div>}
      {isRemove && <div className={styles.bottomSector}>
      <button onClick={() => onDelete(notes.noteId)} className={styles.saveButton} > <img height="20px" width="20px" src="/remove.svg"/> Remove</button>
      </div>}

    </div>
  )
}

export default Notecard