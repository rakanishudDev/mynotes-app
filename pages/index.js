import styles from '../styles/Index.module.css'
import { useEffect, useState } from 'react'
import {unstable_getServerSession} from 'next-auth'
import {useSession} from 'next-auth/react'
import { authOptions } from './api/auth/[...nextauth]'
import Link from 'next/link'

export default function Home({data}) {

  const [categoryName, setCategoryName] = useState('')
  const [categories, setCategories] = useState()
  const [edit, setEdit] = useState(false);

  const {data: session, status} = useSession();

  const createCategoryFetch = async function(url, bodyData) {
    return new Promise( async (resolve, reject) => {
      try {
        const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(bodyData)
        })
        resolve(res)
    } catch (err) {
        console.log(err)
        reject(err)
    }
    }) 
  }
  
  const createNewCategory = async () => {
    //////
    if (categoryName === '') {
      return
    }
    //////
    const date = Date.now()
    const categoryId = Math.floor(Math.random() * 1000) + Date.now() + ''

    const newCategory = {
      categoryId: categoryId,
      uid: session.user.id,
      date: date,
      categoryName: categoryName
    }
    //////
    await Promise.all([
      createCategoryFetch('/api/account', newCategory),
      createCategoryFetch('/api/category/', newCategory)
    ]).catch(err => console.log(err))
    
    //////
    categories.unshift(newCategory)
    setCategories([...categories])
  }
  
  const onDelete = async (categoryid) => {
    // promise
    const deleteCategoryPromise = async (url) => {
      return new Promise(async (resolve, reject) => {
        try {
          const accountDeleteCategory = await fetch(url, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              uid: session.user.id,
              categoryId: categoryid
            })
          })
          resolve(await accountDeleteCategory.json())
        }
        catch(err) {
          console.log(err)
          reject(err)
        }
      })
    }
    const newCategories = categories.filter(category => category.categoryId !== categoryid)
    // promise all
    await Promise.all([
      deleteCategoryPromise("/api/account"),
      deleteCategoryPromise("/api/category")
    ]).then(res => {
      setCategories([...newCategories])
    }).catch(err => console.log(err))
    setEdit(false)
  }

  useEffect(() => {
    setCategories([...data])
  }, [data])


  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftSide}>
        <div className={styles.createCategoryContainer}>
          <img onClick={createNewCategory} className={styles.addSvg} width="40px" height="40px" src="/add.svg" alt="add" />
          <input onChange={(e) => setCategoryName(e.target.value)} value={categoryName} className={styles.inputCategory} type="text" placeholder="New Category" />
          
        </div>
        <div className={styles.categoryContainer}>
          {categories && categories.map(category => {
            return (
              <div key={category.categoryId} className={styles.categoryBoxContainer}>
                <div className={styles.categoryBox}>
                  <Link href={`/${category.categoryId}/notes`}><a><h3 className={styles.categoryName}>{category.categoryName}</h3></a></Link>
                </div>
                {edit && <img onClick={() => onDelete(category.categoryId)} className="cursor-pointer" height="20px" width="20px" src="/close.svg" alt="delete" />}
              </div>
            )
          })}
        </div>
        {categories && categories.length !== 0 && (
        <div className={styles.editContainer} >
          <div onClick={() => setEdit(!edit)} className={styles.editContainer + " cursor-pointer"}>
            <img className="cursor-pointer" width="20px" height="20px" src="/edit.svg" alt="edit" />
            <p>Options</p>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions);
  let data;
  if (session) {
    try {
      const res = await fetch('https://mynotes-bay.vercel.app/api/account/' + session.user.id)
      data = await res.json()
    } catch(err) {
      console.log(err)
    }
  }
  if (!session) {
    return {
      redirect: {
        destination: 'https://mynotes-bay.vercel.app/api/auth/signin?callbackUrl=https://mynotes-bay.vercel.app',
        permanent: false
      }
    }
  }
  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
      data: data && data
    }
  }
} 
