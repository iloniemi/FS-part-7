import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../requests'
import { Link } from 'react-router-dom'

const Users = ({ users }) => {
  if (!users) return null

  return (
    <table>
      <tbody>
        <tr><td></td><td>blogs created</td></tr>
        { users.map(user => (
          <tr key={user.id}>
            <td><Link to={`/users/${user.id}`} >{user.name}</Link></td><td>{user.blogs.length}</td>
          </tr>
        )) }
      </tbody>
    </table>
  )
}

export default Users