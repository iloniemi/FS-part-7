import { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { changeBlog, deleteBlog } from '../requests'
import { useUserValue } from '../UserContext'
import { setNotification, useNotificationDispatch } from '../NotificationContext'
import { useParams } from 'react-router-dom'

const Blog = ({ blogs }) => {
  const [showAll, setShowAll] = useState(false)
  const queryClient = useQueryClient()
  const user = useUserValue()
  const token = user.token
  const notificationDispatch = useNotificationDispatch()
  const id = useParams().id
  const blog = blogs.find(blog => blog.id === id)

  const showNotification = (message) => setNotification(notificationDispatch, message)

  const thisUsersBlog = blog.user.username === user.username

  const addLikeMutation = useMutation({
    mutationFn: changeBlog,
    onSuccess: (recievedBlog) => {
      const changedBlog = { ...recievedBlog, user: blog.user } // changing from just id to whole user
      const blogs = queryClient.getQueryData(['blogs'])
      const changedBlogs = blogs.map(blog => blog.id === changedBlog.id ? changedBlog : blog)
      queryClient.setQueryData(['blogs'], changedBlogs)
    },
    onError: (exception) => {
      showNotification('something went wrong')
      console.log(exception)
      if (exception.response.status === 400) {
        showNotification(exception.response.data.error)
      }
    }
  })

  const removeBlogMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: (exception) => {
      console.log('error', exception)
      showNotification(exception.response.data.error)
    }
  })

  const handleLike = () => {
    const changedBlog = {
      ...blog,
      user: blog.user.id, // server uses just user.id as user
      likes: blog.likes+1
    }
    addLikeMutation.mutate({ blog: changedBlog, token })
  }

  const handleRemove = () => {
    removeBlogMutation.mutate({ id: blog.id, token })
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={ blogStyle }>
      <div>
        <h1>{ `${blog.title} by ${blog.author}` }</h1>
        <a href={blog.url} data-testid={`blog-url-${blog.id}`} >{blog.url}</a>
        <div data-testid={`blog-likes-${blog.id}`} >
          {`likes ${blog.likes}`}
          <button onClick={handleLike} data-testid={`blog-like-button-${blog.id}`}>
          like
          </button></div>
        <div>added by {blog.user.name}</div>
        { thisUsersBlog && <div><button onClick={handleRemove} data-testid={`blog-remove-button-${blog.id}`} >
        remove
        </button></div>}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blogs: PropTypes.array.isRequired,
}

export default Blog