import Head from 'next/head'
import Header from '../components/Header'
import Login from "../components/Login"
import { getSession } from 'next-auth/react'
import Sidebar from '../components/Sidebar'
import Feed from '../components/Feed'
import Widgets from '../components/Widgets'
import { db } from '../firebase'

// bale nandito na yung data kung nakalogin na ba o hindi pa
export default function Home({ session, posts }) {
  if (!session) return <Login /> // if hindi pa, labas mo login component, pag nakalogin na labas mo yung return
  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      <Head>
        <title>Facebook</title>
      </Head>

      <Header />

      <main className="flex">
        <Sidebar />
        <Feed posts={posts} />
        <Widgets />
      </main>
    </div>
  )
}

// getServerSideProps sa nextJs to para maging aware sya na need natin alamin kung nakalogin na ba ang user o hindi pa
// yung context yan yung data na naglalaman kung nakalogin na ba or nakalogout
export async function getServerSideProps(context) {
  // Get the user
  const session = await getSession(context) // nakalogin na ba o hindi pa

  const posts = await db.collection('posts').orderBy('timestamp', 'desc').get()

  const docs = posts.docs.map(post => ({
    id: post.id,
    ...post.data(),
    timestamp: null
  }))

  return {
    props: {
      session,
      posts: docs
    }
  }
}