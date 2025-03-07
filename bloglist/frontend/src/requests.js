import axios from 'axios'

const baseUrl = '/api/blogs'

const createConfig = (token) => ({ headers: { Authorization: token } })

export const getBlogs = () =>
  axios.get(baseUrl).then(response => response.data)

export const createBlog = (blogAndToken) => {
  const newBlog = blogAndToken.blog
  const config = createConfig(blogAndToken.token)
  return axios.post(baseUrl, newBlog, config).then(response => response.data)
}

export const changeBlog = (blogAndToken) => {
  const changedBlog = blogAndToken.blog
  const config = createConfig(blogAndToken.token)
  return axios.put(`${baseUrl}/${changedBlog.id}`, changedBlog, config).then(response => response.data)
}

export const deleteBlog = (idAndToken) => {
  const id = idAndToken.id
  const config = createConfig(idAndToken.token)
  return axios.delete(`${baseUrl}/${id}`, config)
}
