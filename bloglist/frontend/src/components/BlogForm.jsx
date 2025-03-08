import { useState } from 'react'
import InputRow from './InputRow'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBlog } from '../requests'
import { useUserValue } from '../UserContext'
import { setNotification, useNotificationDispatch } from '../NotificationContext'
import { Button } from '@mui/material'

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const notificationDispatch = useNotificationDispatch()
  const showNotification = (message) => setNotification(notificationDispatch, message)

  const user = useUserValue()
  const token = user.token
  const queryClient = useQueryClient()
  const newBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
    onError: (exception) => {
      showNotification('something went wrong')
      console.log(exception)
      if (exception.response.status === 400) {
        showNotification(exception.response.data.error)
      }
    }
  })

  const handleNewBlog = (event) => {
    event.preventDefault()
    console.log('create new blog')

    newBlogMutation.mutate({
      blog: { title, author, url },
      token
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return <>
    <h2>create new</h2>

    <form onSubmit={handleNewBlog}>
      <InputRow name='Title' value={title} setValue={setTitle} placeholder={'type in the title'} testid='new-blog-title'/>
      <InputRow name='Author' value={author} setValue={setAuthor} placeholder={'type in the author'} testid='new-blog-author' />
      <InputRow name='Url' value={url} setValue={setUrl} placeholder={'type in the url'} testid='new-blog-url' />
      <Button type='submit' data-testid='new-blog-submit-button' >create</Button>
    </form>
  </>
}

export default BlogForm