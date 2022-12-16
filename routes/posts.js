const express = require("express");
const router = express.Router();

// 1. 전체 게시글 목록 조회
router.get("/posts", async (req, res) => {
  const getAllPosts = await Posts.find();
  res.status(200).json({ getAllPosts });
});

// 3. 게시글 조회
router.get("/posts/:postsId", async (req, res) => {
  const { postsId } = req.params;
  const getOnePost = await Posts.find({ postsId: Number(postsId) });
  res.json(getOnePost);
});

// 4. 게시글 수정
router.put("/posts/:postsId", async (req, res) => {
  const { postsId } = req.params;
  const { description, password } = req.body;

  // const editPosts = await Posts.findById(id);
  const editPosts = await Posts.find({ postsId, password });
  const pw = editPosts[0].password;
  //   return res.status(400).json({
  //     success: false,
  //     errorMessage: "잘못된 접근입니다.",
  //   });
  // } else if (editPosts !== null) {
  //   const pw = editPosts[0].password;
  //   if (pw != password) {
  //     return res.status(400).json({
  //       success: false,
  //       errorMessage: "비밀번호가 틀렸습니다.",
  //     });
  //   } else if (editPosts.length && pw == password) {
  //     await Posts.updateOne(
  //       { postsId: postsId },
  //       { $set: { description: description } }
  //     );
  //   }
  //   res.status(200).json({ success: true });
  // }
  // const pwCheck = await Posts.find({ password });

  try {
    if (!pw || !description.length) {
      return res.status(400).json({
        success: false,
        errorMessage: "잘못된 접근입니다.",
      });
    } else if (pw != password) {
      return res.status(400).json({
        success: false,
        errorMessage: "비밀번호를 확인해 주세요.",
      });
    } else if (editPosts.length && pw == password) {
      await Posts.updateOne(
        { postsId: postsId },
        { $set: { description: description } }
      );
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.log("잘못된 접근입니다.", `Error: ${err.message}`);
  }
});

// 5. 게시글 삭제
router.delete("/posts/:postsId", async (req, res) => {
  const { postsId } = req.params;
  const { password } = req.body;

  const deletePosts = await Posts.find({ postsId, password });
  const pw = deletePosts[0].password;

  try {
    // if (postsId)
    if (!pw || pw != password) {
      return res.status(400).json({
        success: false,
        errorMessage: "비밀번호를 확인해 주세요.",
      });
    } else if (deletePosts.length && pw == password) {
      await Posts.deleteOne({ postsId });
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.log("잘못된 접근입니다.", `Error: ${err.message}`);
  }
});

// 2. 게시글 작성
const Posts = require("../schemas/post.js");
router.post("/posts/", async (req, res) => {
  const { postsId, user, password, title, name, createdAt, description } =
    req.body;
  const posts = await Posts.find({ postsId });
  if (posts.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "이미 존재하는 PostsId입니다.",
    });
  }
  if (!title.length || !description.length) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "빈칸을 채워주세요!" });
  }

  const createdPosts = await Posts.create({
    postsId,
    user,
    password,
    title,
    name,
    createdAt,
    description,
  });

  res.json({ posts: createdPosts, Message: "포스트 작성이 완료되었습니다👏" });
});

module.exports = router;
