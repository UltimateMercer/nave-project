'use strict'

const { validate } = use('Validator')
//const Database = use("Database");
const Post = use('App/Models/Post')

class PostController {
  async index({ response }) {
    response.json(await Post.all())
  }

  async show({ params, response }) {
    const id = Number(params.id)
    const post = await Post.find(id)

    if (!post) {
      response.notFound({
        error: 'Not Found'
      })
      return
    }

    response.json(post)
  }

  async store({ request, response }) {
    const newPostData = request.only(['author', 'title', 'text'])

    const rules = {
      author: 'required|string',
      title: 'required|string',
      text: 'required|string'
    }

    const validation = await validate(newPostData, rules)

    if (validation.fails()) {
      response.badRequest(validate.messages())
      return
    }

    const post = new Post()
    post.author = newPostData.author
    post.title = newPostData.title
    post.text = newPostData.text

    //Database only for

    // const baseTime = new Date()

    // let data2 = new Date(baseTime.valueOf() - baseTime.getTimezoneOffset() * 60000)
    // const time = data2.toISOString().replace(/\.\d{3}Z$/, '')

    // const insertPost = await Database
    //   .insert({ author: post.author, title: post.title, text: post.text, created_at: time, updated_at: time })
    //   .into('posts')
    //   .returning('id')

    // response.json(insertPost)

    await post.save()
    response.json(post)

  }

  async update({ params, request, response }) {
    const id = Number(params.id)
    const post = await Post.find(id)

    if (!post) {
      response.notFound({
        error: 'Not Found'
      })
      return
    }

    const updates = request.only(['author', 'title', 'text'])

    const newPost = {
      ...post,
      ...updates
    }

    const rules = {
      author: 'string',
      title: 'string',
      text: 'string'
    }

    const validation = await validate(newPost, rules)

    if (validation.fails()) {
      response.badRequest(validate.messages())
      return
    }

    post.merge(updates)
    await post.save()

    response.json(post)
  }

  async destroy({ params, response }) {
    const id = Number(params.id)
    const post = await Post.find(id)

    if (!post) {
      response.notFound({
        error: 'Not Found'
      })
      return
    }

    await post.delete()

    response.noContent({})
  }
}

module.exports = PostController
