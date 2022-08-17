import React, { useEffect, useState } from 'react'
import styles from '../styles/OpenedNotecard.module.css'

const OpenedNotecard = ({notes, closeNotecard, uid, categoryId, onDeleteOpened, changeContentState}) => {

    const [heading, setHeading] = useState(notes.heading);
    const [text, setText] = useState(notes.text);
    const [editOn, setEditOn] = useState(false);
    const [isRemove, setIsRemove] = useState(false);

    const onEdit = () => {
        console.log({text, heading})
        setIsRemove(false)
        setEditOn(!editOn)
    }
    const onDelete = () => {
        
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
    const onEditSave = async () => {
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
      console.log(updatedNote)
      setEditOn(false)
      try {
        const updatedDoc = await fetch("/api/notes", {
          method: "PUT",
          body: JSON.stringify(updatedNote)
        })
        setHeading(heading)
        setText(text)
        changeContentState(heading, text)
      } catch (err) {
        console.log(err)
      }
      setEditOn(false)
    }
    
  return (
    <div onMouseDown={(e) => closeNotecard(e)} id="closingBg" className={styles.componentContainer}>
        <div className={styles.container}>
          <div className={styles.notecardContainer}>
              <div className={styles.topSector}>
              {editOn ? 
                  <input className={styles.headingInput} autoFocus type="text" placeholder="heading" onChange={onChangeHeading} value={heading} /> 
                  : 
                  <p className={styles.heading}>{heading}</p>}
                  <div className={styles.topSectorTools}>
                      <img className="cursor-pointer" onClick={onEdit} height="20px" width="20px" src="/edit.svg" alt="edit" />
                      <img className="cursor-pointer" onClick={onRemove} height="20px" width="20px" src="/close.svg" alt="close" />
                  </div>
              </div>
              <div className={styles.midSector}>
                <textarea value={text} onChange={onChangeText} disabled={!editOn} spellCheck="false" className={`${styles.textarea} ${!editOn ? styles.textareaBorderNone : ''}`} />
              </div>
              {editOn && 
              <div className={styles.bottomSector}>
                <button onClick={onEditSave} className={styles.saveButton} > <img height="20px" width="20px" src="/save.svg"/> <p>Save</p></button>
              </div>}
              {isRemove && 
              <div className={styles.bottomSector}>
                <button onClick={onDeleteOpened} className={styles.removeButton} > <img height="20px" width="20px" src="/remove.svg"/><p> Remove</p></button>
              </div>}
          </div>
        </div>
    </div>
  )
}

export default OpenedNotecard