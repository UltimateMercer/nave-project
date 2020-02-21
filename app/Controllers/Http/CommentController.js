'use strict'

//const { validate } = use('Validator')
//const Post = use('App/Models/Post')

class CommentController {
  async index({ response }) {
    //
  }

  async show({ params, response }) {
    const id = Number(params.id);
    const comment = await Comment.find(id);

    if (!comment) {
      response.notFound({
        error: "Not Found"
      });
      return;
    }

    response.json(comment);
  }

  async store({ request, response }) {
    const newCommentData = request.only(['author', 'text', 'post'])

    const rules = {
      author: "required|string",
      text: "required|string",
      post: "required|integer"
    }

    const validation = await Validate(newCommentData, rules);

    if (validation.fails()) {
      response.badRequest(validate.messages());
      return;
    }

    const comment = new Comment();
    Comment.author = newCommentData.author;
    Comment.post = newCommentData.post;
    Comment.text = newCommentData.text;

    await comment.save();

    response.json(comment);
  }

  async update({ params, request, response }) {
    const id = Number(params.id);
    const comment = await Comment.find(id);

    if (!comment) {
      response.notFound({
        error: "Not Found"
      });
      return;
    }

    const updates = request.only(['author', 'text', 'post'])

    const newComment = {
      ...comment,
      ...updates
    }

    const rules = {
      author: "string",
      text: "string",
      post: "integer"
    };

    const validation = await Validate(newComment, rules);

    if (validation.fails()) {
      response.badRequest(validate.messages());
      return;
    }

    comment.merge(updates);
    await comment.save();

    response.json(comment);
  }


}

module.exports = CommentController
