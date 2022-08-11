import Link from 'next/link'
import React from 'react'
import styles from '../styles/Nav.module.css'
import {useSession} from 'next-auth/react'

const Nav = () => {
  const {data: session, status} = useSession()
  return (
    <nav className={styles.navbar}>
      <Link href="/"><a>
          <h1><i>My Notes</i></h1>
        </a></Link>
        <nav className={styles.nav}>
          <ul>
            {session && status === 'authenticated' && (<li>
            <Link href="/account"><a>
                    {session.user.name}
                  </a></Link>
            </li>)}
            {!session && status !== 'authenticated' && (
              <li><Link href="/api/auth/signin?callbackUrl=https://mynotes-bay.vercel.app"><a>
                    Sign In
                  </a></Link></li>
            )}
            {session && status === 'authenticated' && (
              <li><Link href="/api/auth/signout"><a>
                    Sign Out
                  </a></Link></li>
            )}
          </ul>
        </nav>
    </nav>
  )
}

export default Nav