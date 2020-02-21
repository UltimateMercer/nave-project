'use strict'

//const { validate } = use('Validator')
//const Post = use('App/Models/Post')

class PostController {
  async index({ response }) {
    //
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

    const validation = await Validate(newPostData, rules)

    if (validation.fails()) {
      response.badRequest(validate.messages())
      return
    }

    const post = new Post()
    Post.author = newPostData.author
    Post.title = newPostData.title
    Post.text = newPostData.text

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

    const validation = await Validate(newPost, rules)

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
