import axios from 'axios'

const baseUrl = '/api/blogs'

const tokenToConfig = (token) => ({ headers: { Authorization: `Bearer ${token}` } })

export const getBlogs = () =>
  axios.get(baseUrl).then(response => response.data)

export const createBlog = (blogAndToken) => {
  const newBlog = blogAndToken.blog
  const config = tokenToConfig(blogAndToken.token)
  return axios.post(baseUrl, newBlog, config).then(response => response.data)
}

export const changeBlog = (blogAndToken) => {
  const changedBlog = blogAndToken.blog
  const config = tokenToConfig(blogAndToken.token)
  return axios.put(`${baseUrl}/${changedBlog.id}`, changedBlog, config).then(response => response.data)
}

export const deleteBlog = (idAndToken) => {
  const id = idAndToken.id
  const config = tokenToConfig(idAndToken.token)
  return axios.delete(`${baseUrl}/${id}`, config)
}

export const getUsers = () => {
  return axios.get('/api/users').then(response => response.data)
}
