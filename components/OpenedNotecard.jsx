import React, { useEffect, useState } from 'react'
import styles from '../styles/OpenedNotecard.module.css'

const OpenedNotecard = ({notes, closeNotecard}) => {

    const [heading, setHeading] = useState(notes.heading);
    const [text, setText] = useState(notes.text);
    const [editOn, setEditOn] = useState(false);

    const onEdit = () => {
        console.log({text, heading})
        setEditOn(!editOn)
    }
    const onDelete = () => {
        
    }
    const onChangeText = (e) => {
    setText(e.target.value)
  }
  const onChangeHeading = (e) => {
    setHeading(e.target.value)
  }
  const onSave = () => {

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
                      <img className="cursor-pointer" onClick={() => onDelete(notes.noteId)} height="20px" width="20px" src="/close.svg" alt="close" />
                  </div>
              </div>
              <div className={styles.midSector}>
                <textarea value={text} onChange={onChangeText} disabled={!editOn} spellCheck="false" className={`${styles.textarea} ${!editOn ? styles.textareaBorderNone : ''}`} />
              </div>
              {editOn && 
              <div className={styles.bottomSector}>
                <button onClick={onSave} className={styles.saveButton} > <img height="20px" width="20px" src="/save.svg"/> Save</button>
              </div>}
          </div>
        </div>
    </div>
  )
}

export default OpenedNotecard