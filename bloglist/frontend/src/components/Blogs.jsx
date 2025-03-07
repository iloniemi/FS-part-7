import Blog from './Blog'
import PropTypes from 'prop-types'

const Blogs = ({ blogs }) => {
  const blogsByLikes = (firstBlog, secondBlog) => secondBlog.likes - firstBlog.likes

  return <div>
    {blogs.sort(blogsByLikes).map(blog => <Blog key={blog.id} blog={blog} /> )}
  </div>
}

Blogs.propTypes = {
  blogs: PropTypes.array.isRequired,
}

export default Blogs