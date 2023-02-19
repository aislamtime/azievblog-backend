import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'

import { registerValidation, loginValidation, postCreateValidation } from './validations/index.js'
import { checkAuth, handleValidationErrors } from './utils/index.js'
import { UserController, PostController } from './controllers/index.js'

mongoose
  .connect(
    'mongodb+srv://timeline:timeline@blog-mern.es1mwrz.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err))

const app = express()

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    const name = `${Date.now()}${file.originalname}`
    cb(null, name)
  },
})
const upload = multer({ storage })

app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({ url: `/uploads/${Date.now()}${req.file.originalname}` })
})

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
)
app.delete('/posts/:id', checkAuth, PostController.remove)

app.listen(4444, (err) => {
  if (err) console.log('Server ERROR ', err)
  else console.log('Server is run!')
})
