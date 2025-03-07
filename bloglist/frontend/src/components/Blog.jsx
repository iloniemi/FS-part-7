import { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { changeBlog, deleteBlog } from '../requests'
import { useUserValue } from '../UserContext'
import { setNotification, useNotificationDispatch } from '../NotificationContext'

const Blog = ({ blog }) => {
  const [showAll, setShowAll] = useState(false)
  const queryClient = useQueryClient()
  const user = useUserValue()
  const token = user.token
  const notificationDispatch = useNotificationDispatch()

  const showNotification = (message) => setNotification(notificationDispatch, message)

  const toggleShowAll = () => setShowAll(!showAll)

  const thisUsersBlog = blog.user.username === user?.username

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


  const extraInfo = () => (
    <>
      <div data-testid={`blog-url-${blog.id}`} >{blog.url}</div>
      <div data-testid={`blog-likes-${blog.id}`} >
        {`likes ${blog.likes}`}
        <button onClick={handleLike} data-testid={`blog-like-button-${blog.id}`}>
          like
        </button></div>
      <div>{blog.user.name}</div>
      { thisUsersBlog && <div><button onClick={handleRemove} data-testid={`blog-remove-button-${blog.id}`} >
        remove
      </button></div>}
    </>
  )

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
        { blog.title} {blog.author }
        <button onClick={ toggleShowAll } data-testid={`blog-info-toggle-button-${blog.id}`} >
          { showAll ? 'hide' : 'view' }
        </button>
      </div>
      { showAll && extraInfo() }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
}

export default Blog