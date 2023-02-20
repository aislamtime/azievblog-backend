import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec()

    res.json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Произошла ошибка при получении данных',
    })
  }
}

export const getNewTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec()

    const tags = posts
      .map((item) => item.tags)
      .flat()
      .slice(0, 5)

    res.json(tags)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Произошла ошибка при получении тегов',
    })
  }
}

export const getOne = async (req, res) => {
  // Получение одного поста
  try {
    const postId = req.params.id // Берем id поста из урла

    // Находим пост по его id и возвращаем его, обновив viewsCount
    await PostModel.findOneAndUpdate(
      {
        // По каким критериям надо искать
        _id: postId,
      },
      // То что надо изменить ($inc - увеличить). Указываем в объекте то что надо изменить и на какое значение
      { $inc: { viewsCount: 1 } },
      // Указываем когда надо вернуть документ, 'after' - перед изменениями,  'before' - после изменении
      { returnDocument: 'after' },
    )
      .then((doc) => res.json(doc)) // Если получение поста прошло успешно, возвращаем его
      .catch((err) => {
        // Если была ощибка, то возвращаем код 404
        res.status(404).json({
          message: 'Статья не найдена',
        })
      })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Произошла ошибка при получении статьи',
    })
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    })

    const post = await doc.save()
    res.json(post)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось создать статью',
    })
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id // Берем id поста из урла

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      },
    ).catch(() => res.status(404).json({ message: 'Статья не найдена' }))

    res.json({
      success: true,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Произошла ошибка при обновлении статьи',
    })
  }
}

export const remove = async (req, res) => {
  // Получение одного поста
  try {
    const postId = req.params.id // Берем id поста из урла

    // Находим пост по его id и удаляем его
    await PostModel.findOneAndDelete({
      // По каким критериям надо искать
      _id: postId,
    })
      .then(() => res.json({ success: true })) // Если получение поста прошло успешно, возвращаем success: true
      .catch(() => {
        // Если была ощибка, то возвращаем код 404
        res.status(404).json({
          message: 'Статья не найдена',
        })
      })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Произошла ошибка при удалении статьи',
    })
  }
}
