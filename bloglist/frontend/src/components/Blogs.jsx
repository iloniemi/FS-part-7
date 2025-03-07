import Blog from './Blog'
import PropTypes from 'prop-types'

const Blogs = ({ blogs, user, token }) => {
  const blogsByLikes = (firstBlog, secondBlog) => secondBlog.likes - firstBlog.likes

  return <div>
    {blogs.sort(blogsByLikes).map(blog => <Blog token={token} key={blog.id} blog={blog} user={user} /> )}
  </div>
}

Blogs.propTypes = {
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired
}

export default Blogs