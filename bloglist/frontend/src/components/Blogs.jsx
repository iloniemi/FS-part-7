import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const Blogs = ({ blogs }) => {
  const blogsByLikes = (firstBlog, secondBlog) => secondBlog.likes - firstBlog.likes
  console.log('blogs', blogs)

  return (
    <div>
      {blogs.sort(blogsByLikes).map(blog => (
        <div key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>{`${blog.title} by ${blog.author}`}</Link>
        </div>
      ))}
    </div>
  )
}

Blogs.propTypes = {
  blogs: PropTypes.array.isRequired,
}

export default Blogs