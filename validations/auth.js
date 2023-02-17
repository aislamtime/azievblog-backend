import { body } from 'express-validator'

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Укажите пароль (минимум 5 символов)').isLength({ min: 5 }),
  body('fullName', 'Укажите имя (минимум 3 символа)').isLength({ min: 3 }),
  body('avatarUrl', 'Неверная ссылка на аватар').optional().isURL(),
]
