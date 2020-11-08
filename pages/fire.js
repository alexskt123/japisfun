import { useState, useEffect, Fragment } from 'react'
import fire from '../config/fire-config'
import Container from 'react-bootstrap/Container'

export default function Fire() {
  const [blogs, setBlogs] = useState([])
  const listBlogs = () => {
    return blogs.map(blog => {

      return (
        <pre key={blog.id}>{JSON.stringify(blog, null, 2)}</pre>
      )
    })
  }

  useEffect(() => {

    fire.firestore()
      .collection('history')
      .onSnapshot(snap => {
        const blogs = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setBlogs(blogs)
      })
  }, [])

  return (
    <Fragment>
        <Container style={{ minHeight: '100vh' }} className="mt-5 shadow-lg p-3 mb-5 bg-white rounded">
        {listBlogs()}
        </Container>

    </Fragment>
  )
}

