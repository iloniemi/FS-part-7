import axios from 'axios'

const baseUrl = '/api/blogs'

export const getBlogs = () =>
  axios.get(baseUrl).then(response => response.data)

export const createBlog = (blogAndToken) => {
  const token = blogAndToken.token
  const newBlog = blogAndToken.blog
  const config = {
    headers: { Authorization: token }
  }
  return axios.post(baseUrl, newBlog, config).then(response => response.data)
}