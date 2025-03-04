require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
  console.log('TEST MODE')
  MONGODB_URI = process.env.MONGODB_URI_TEST
}

if (process.env.NODE_ENV === 'development') {
  console.log('DEV MODE')
  MONGODB_URI = process.env.MONGODB_URI_TEST
}


module.exports = {
  MONGODB_URI,
  PORT
}