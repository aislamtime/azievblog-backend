import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'

export const register = async (req, res) => {
  //? REGISTER
  try {
    //const errors = validationResult(req)
    //if (!errors.isEmpty()) return res.status(400).json(errors.array())

    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
      email: req.body.email,
      passwordHash: hash,
      fullName: req.body.fullName,
      avataUrl: req.body.avataUrl,
    })

    const user = await doc.save()

    const token = jwt.sign({ _id: user._id }, 'secretIslam', { expiresIn: '30d' })

    const { passwordHash, ...userData } = user._doc
    res.json({ ...userData, token })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось зарегестрироваться',
    })
  }
}
export const login = async (req, res) => {
  //? LOGIN
  try {
    const user = await UserModel.findOne({ email: req.body.email })

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      })
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      })
    }

    const token = jwt.sign({ _id: user._id }, 'secretIslam', { expiresIn: '30d' })

    const { passwordHash, ...userData } = user._doc
    res.json({ ...userData, token })
  } catch (error) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    })
  }
}
export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)

    if (!user)
      return res.status(404).json({
        message: 'Пользователь не найден',
      })

    const { passwordHash, ...userData } = user._doc

    res.json(userData)
  } catch (err) {
    console.log(err)
    res.status(403).json({
      message: 'Нет доступа',
    })
  }
}
