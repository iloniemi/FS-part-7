import { useParams } from 'react-router-dom'

const User = ({ users }) => {
  const id = useParams().id

  if (!users) return <p>Loading data</p>
  const user = users.find(user => user.id === id)

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        { user.blogs.map(blog => <li key={blog.id}>{blog.title}</li>) }
      </ul>
    </div>
  )
}

export default User