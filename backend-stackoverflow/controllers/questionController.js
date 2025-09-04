const questionService = require("../services/questionService");

exports.createQuestion = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    const question = await questionService.createQuestion({
      title,
      content,
      tags,
      author: req.user._id,
    });
    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
};

exports.getAllQuestions = async (req, res, next) => {
  try {
    let {
      page = 1,
      perPage = 15,
      sortedBy = "newest",
      noAnswers = "false",
    } = req.query;

    page = Number(page);
    perPage = Number(perPage);
    noAnswers = noAnswers === "true";

    const questions = await questionService.getAllQuestions({
      page,
      perPage,
      sortedBy,
      noAnswers,
    });
    res.json(questions);
  } catch (err) {
    next(err);
  }
};

exports.toggleUpvote = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const result = await questionService.toggleUpvote(questionId, req.user._id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.updateQuestion = async (req, res, next) => {
  try {
    const updated = await questionService.updateQuestion(
      req.params.id,
      req.body,
      req.user._id
    );
    res.json(updated);
  } catch (err) {
    if (err.message === "NOT_FOUND") {
      return res.status(404).json({ message: "Question not found" });
    }
    if (err.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Permission denied" });
    }
    next(err);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    await questionService.deleteQuestion(req.params.id, req.user);
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    if (err.message === "NOT_FOUND") {
      return res.status(404).json({ message: "Question not found" });
    }
    if (err.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Permission denied" });
    }
    next(err);
  }
};

exports.searchQuestions = async (req, res, next) => {
  try {
    const { q, sort, tags: tagName } = req.query;
    const questions = await questionService.searchQuestions({
      q,
      sortBy: sort,
      tagName,
    });
    res.json(questions);
  } catch (err) {
    next(err);
  }
};

exports.getQuestionsByUser = async (req, res, next) => {
  try {
    const questions = await questionService.getQuestionsByUserIfFollowed(
      req.user._id,
      req.params.id
    );
    res.json(questions);
  } catch (err) {
    if (err.message === "NOT_ALLOWED") {
      return res.status(403).json({
        message: "Bạn cần follow người này để xem câu hỏi của họ.",
      });
    }
    next(err);
  }
};

exports.getQuestionsById = async (req, res, next) => {
  try {
    const questions = await questionService.getQuestionsById(req.params.id);
    res.json(questions);
  } catch (err) {
    if (err.message === "NOT_ALLOWED") {
      return res.status(403).json({
        message: "Bạn cần follow người này để xem câu hỏi của họ.",
      });
    }
    next(err);
  }
};
