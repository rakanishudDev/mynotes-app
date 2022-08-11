import { unstable_getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import React from 'react'
import { authOptions } from './api/auth/[...nextauth]'

const account = () => {
    const {data: session, status} = useSession()
    console.log(session)
  return (
    <div>account</div>
  )
}

export default account

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