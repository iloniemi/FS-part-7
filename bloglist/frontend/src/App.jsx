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
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Users from './components/Users.jsx'
import User from './components/User.jsx'
import Blog from './components/Blog.jsx'


const App = () => {
  const notificationText = useNotificationText()
  const notificationDispatch = useNotificationDispatch()
  const userDispatch = useUserDispatch()
  const loggedInUser = useUserValue()

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
    showNotification('logged out')
  }

  const padding = {
    padding: 5
  }

  // When not logged in
  if (!loggedInUser) return (
    <div>
      { notificationText && <h1>{notificationText}</h1> }
      <LoginForm handleLogin={handleLogin} />
    </div>
  )
  // When logged in
  return (
    <BrowserRouter>
      <div>
        <Link to='/' style={padding}>blogs</Link>
        <Link to='/users' style={padding}>users</Link>
        <span style={padding}>
          {loggedInUser.name} logged in
        </span>
        <button onClick={handleLogout} data-testid='logout-button' >logout</button>
      </div>
      { notificationText && <h1>{notificationText}</h1> }
      <h2>blogs</h2>
      <Routes>
        <Route path='/users' element={<Users users={users} />} />
        <Route path="/users/:id" element={<User users={users} />} />
        <Route path="/blogs/:id" element={blogs ? <Blog blogs={blogs} /> : <div></div>} />
        <Route path='/' element={<>
          { blogsResult.isLoading && <p>Loading blogs</p> }
          { blogsResult.isSuccess && <Blogs blogs={blogs} /> }
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm token={blogService.getToken()}  />
          </Togglable>
        </>}/>
      </Routes>
    </BrowserRouter>
  )
}


export default App