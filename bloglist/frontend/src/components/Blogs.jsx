import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'

const Blogs = ({ blogs }) => {
  const blogsByLikes = (firstBlog, secondBlog) => secondBlog.likes - firstBlog.likes
  console.log('blogs', blogs)

  return (
    <div>
      <h2>Blogs</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {blogs.sort(blogsByLikes).map(blog => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
                <TableCell>
                  {blog.author}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

Blogs.propTypes = {
  blogs: PropTypes.array.isRequired,
}

export default Blogs