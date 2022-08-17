import { unstable_getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { authOptions } from './api/auth/[...nextauth]'

const Account = () => {
    const {data: session, status} = useSession()
    console.log(session)
  return (
    <div><h1>Welcome {session.user.name} <span> {session && status === 'authenticated' && (<Link href="/api/auth/signout"><a><i>, Sign Out</i></a></Link>)}</span></h1></div>
  )
}

export default Account

export async function getServerSideProps(ctx) {
    const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions);
    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }
    return {
        props: {
            session
        }
    }
}