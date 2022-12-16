const express = require("express");
const router = express.Router();

// 6. 댓글 목록 조회
router.get("/comments/:postsId", async (req, res) => {
  const { postsId } = req.params;
  const getPostComments = await Comments.find({ postsId: Number(postsId) });
  res.status(200).json({ getPostComments });
});

// 8. 댓글 수정
router.put("/comments/:postsId", async (req, res) => {
  const { postsId } = req.params;
  const { commentsId, password, commentsTxt } = req.body;

  const editComments = await Comments.find({ commentsId, password });
  const pw = editComments[0].password;

  try {
    if (!pw || !commentsTxt.length) {
      return res.status(400).json({
        success: false,
        errorMessage: "잘못된 접근입니다.",
      });
    } else if (pw != password) {
      return res.status(400).json({
        success: false,
        errorMessage: "비밀번호를 확인해 주세요.",
      });
    } else if (editComments.length && pw == password) {
      await Comments.updateOne(
        { commentsId: commentsId },
        { $set: { commentsTxt: commentsTxt } }
      );
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.log("잘못된 접근입니다.", `Error: ${err.message}`);
  }
});

// // 9. 댓글 삭제
router.delete("/comments/:postsId", async (req, res) => {
  const { commentsId, password } = req.body;

  const deleteComments = await Comments.find({ commentsId, password });
  const pw = deleteComments[0].password;

  try {
    if (!pw || pw != password) {
      return res.status(400).json({
        success: false,
        errorMessage: "비밀번호를 확인해 주세요.",
      });
    } else if (deleteComments.length && pw == password) {
      await Comments.deleteOne({ commentsId });
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.log("잘못된 접근입니다.", `Error: ${err.message}`);
  }
});

// 7. 댓글 작성
const Comments = require("../schemas/comment.js");
router.post("/comments/:postsId", async (req, res) => {
  const { postsId } = req.params;
  const { commentsId, password, name, createdAt, commentsTxt } = req.body;
  const comments = await Comments.find({ commentsId });
  if (comments.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "이미 존재하는 commentsId입니다.",
    });
  }
  if (!commentsTxt.length) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "댓글을 입력하세요!" });
  } else if (!password.length) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "비밀번호를 입력하세요!" });
  }

  const createdComments = await Comments.create({
    commentsId,
    password,
    name,
    createdAt,
    commentsTxt,
    postsId,
  });

  res.json({ comments: createdComments, Message: "댓글이 작성되었습니다👏" });
});

module.exports = router;
