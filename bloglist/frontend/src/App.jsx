import { useEffect, useRef } from 'react'
import Blogs from './components/Blogs.jsx'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import { setNotification, useNotificationDispatch, useNotificationText } from './NotificationContext.jsx'
import { useQuery } from '@tanstack/react-query'
import { getBlogs, getUsers } from './requests.js'
import { useUserDispatch, useUserValue, userActions } from './UserContext.jsx'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Users from './components/Users.jsx'
import User from './components/User.jsx'
import Blog from './components/Blog.jsx'
import { AppBar, Button, Container, IconButton, Toolbar } from '@mui/material'


const App = () => {
  const notificationText = useNotificationText()
  const notificationDispatch = useNotificationDispatch()
  const userDispatch = useUserDispatch()
  const loggedInUser = useUserValue()
  const navigate = useNavigate()

  const showNotification = (message) => {
    setNotification(notificationDispatch, message)
  }

  const blogFormRef = useRef()

  // new way
  const blogsResult = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs
  })
  console.log(JSON.parse(JSON.stringify(blogsResult)))
  const blogs = blogsResult.data

  const usersResult = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })
  console.log(JSON.parse(JSON.stringify(usersResult)))

  const users = usersResult.data

  // Getting logged in user from localStorage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      userDispatch(userActions.setUser(loggedUser))
    } else {
      navigate('/login')
    }
  }, [])



  const handleLogin = async (username, password) => {
    try {
      const loggedUser = await loginService.login({
        username,
        password
      })
      console.log('logged in as ', loggedUser.name)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(loggedUser)
      )
      userDispatch(userActions.setUser(loggedUser))
    } catch (exception) {
      showNotification('wrong credentials')
    }
  }

  const handleLogout = () => {
    console.log(`logged out ${loggedInUser.name}`)

    window.localStorage.removeItem('loggedBlogappUser')
    userDispatch(userActions.reset())
    navigate('/login')
  }

  return (
    <Container>
      <AppBar position='static'>
        <Toolbar>
          <IconButton edge='start' color='inherit' aria-label='menu'/>
          <Button color='inherit' component={Link} to='/'>blogs</Button>
          <Button color='inherit' component={Link} to='/users'>users</Button>
          {loggedInUser && <em>{loggedInUser.name} logged in</em>}
          {loggedInUser && <Button variant='contained' disableElevation onClick={handleLogout} data-testid='logout-button'>logout</Button>}
        </Toolbar>
      </AppBar>
      { notificationText && <h1>{notificationText}</h1> }
      <Routes>
        <Route path='/login' element={<LoginForm handleLogin={handleLogin} />} />
        <Route path='/users' element={<Users users={users} />} />
        <Route path="/users/:id" element={<User users={users} />} />
        <Route path="/blogs/:id" element={blogs ? <Blog blogs={blogs} /> : <div></div>} />
        <Route path='/' element={<>
          { blogsResult.isLoading && <p>Loading blogs</p> }
          { blogsResult.isSuccess && <Blogs blogs={blogs} /> }
          {loggedInUser && <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm token={blogService.getToken()}  />
          </Togglable>}
        </>}/>
      </Routes>
    </Container>
  )
}


export default App