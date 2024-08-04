const Post = require("../models/postsModel");
const Comment = require("../models/commentModel");
const Reply = require("../models/replyModel");
const User = require("../models/userModel");
 
exports.createPost = async (req, res) => {
   
  const post = new Post({
    userId: req.body.userId,
    content: req.body.content,
    images: req.body.images,
    gif: req.body.gif,
    isRepost : req.body.isRepost,
    tweet_id : req.body.tweet_id

  });
  try {
    const savePost = await post.save();
    res.status(200).json({
      post: savePost,
    });
  } catch (error) {}
};
exports.getPosts = async (req, res) => {
  try {
    const results = await Post.find({
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.searchTerm && {
        $or: [
          {
            content: { $regex: req.query.searchTerm, $options: "i" },
          },
        ],
      }),
    }).sort({ createdAt: -1 });

    const comments = await Comment.find({
      postId: req.query.postId,
    }).sort({ createdAt: -1 });

    const replies = await Reply.find({
      postId: req.query.postId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      posts: results,
      comments,
      replies,
    });
  } catch (error) {}
};

exports.getComment = async (req, res) => {
  try {
    const comments = await Comment.find({
      postId: req.query.postId,
    }).sort({ createdAt: -1 });

    const replies = await Reply.find({
      postId: req.query.postId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      comments,
      replies,
    });
  } catch (error) {}
};

exports.likePost = async (req, res) => {
  try {
    const isLiked = await Post.find({
      _id: req.body.postId,
      likes: { $in: [req.body.userId] },
    });
    if (isLiked.length > 0) {
      await Post.updateOne(
        {
          _id: req.body.postId,
        },
        {
          $pull: { likes: req.body.userId },
        }
      );
    } else {
      await Post.updateOne(
        {
          _id: req.body.postId,
        },
        {
          $push: { likes: req.body.userId },
        }
      );
    }

    const post = await Post.findOne({ _id: req.body.postId });

    res.status(200).json({
      post,
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.addComment = async (req, res) => {
  try {
    const Bcomment = new Comment({
      postId: req.body.postId,
      content: req.body.comment,
      photo: req.body.image,
      gif: req.body.gif,
      userId: req.body.userId,
    });

    const comment = await Bcomment.save();
    await Post.updateOne(
      { _id: req.body.postId },
      {
        $push: { comments: comment._id },

        $inc: { NoOfComments: 1 },
      }
    );

    res.status(200).json({
      comment,
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.likeComment = async (req, res) => {
  try {
    const isLiked = await Comment.find({
      _id: req.body.commentId,
      likes: { $in: [req.body.userId] },
    });

    if (isLiked.length > 0) {
      await Comment.updateOne(
        {
          _id: req.body.commentId,
        },
        {
          $pull: { likes: req.body.userId },
        }
      );
    } else {
      await Comment.updateOne(
        {
          _id: req.body.commentId,
        },
        {
          $push: { likes: req.body.userId },
        }
      );
    }
    const comment = await Comment.findOne({ _id: req.body.commentId });

    res.status(200).json({
      comment,
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.likeReply = async (req, res) => {
  try {
    const isLiked = await Reply.find({
      _id: req.body.replyId,
      likes: { $in: [req.body.userId] },
    });

    if (isLiked.length > 0) {
      await Reply.updateOne(
        {
          _id: req.body.replyId,
        },
        {
          $pull: { likes: req.body.userId },
        }
      );
    } else {
      await Reply.updateOne(
        {
          _id: req.body.replyId,
        },
        {
          $push: { likes: req.body.userId },
        }
      );
    }
    const reply = await Reply.findOne({ _id: req.body.replyId });

    res.status(200).json({
      reply,
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.addReply = async (req, res) => {
  try {
    const Breply = new Reply({
      postId: req.body.postId,
      content: req.body.comment,
      commentId: req.body.commentId,
      photo: req.body.image,
      gif: req.body.gif,
      userId: req.body.userId,
    });

    await Post.updateOne(
      { _id: req.body.postId },
      {
        $inc: { NoOfComments: 1 },
      }
    );

    const replies = await Breply.save();
    await Comment.updateOne(
      { _id: req.body.commentId },
      {
        $push: { replies: replies._id },
      }
    );

    res.status(200).json({
      reply: replies,
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.getReply = async (req, res) => {
  try {
    const resReply = await Reply.findOne({
      _id: req.query.replyId,
      commentId: req.query.commentId,
    });

    res.status(200).json({
      reply: resReply,
    });
  } catch (error) {}
};

exports.followUser = async (req, res) => {
  try {
    const isFollowing = await User.find({
      _id: req.body.followedUser,
      followings: { $in: [req.body.followUser] },
    });

    if (isFollowing.length > 0) {
      await User.updateOne(
        { _id: req.body.followedUser },
        {
          $pull: { followings: req.body.followUser },
        }
      );
      await User.updateOne(
        { _id: req.body.followUser },
        {
          $pull: { followers: req.body.followedUser },
        }
      );
    } else {
      await User.updateOne(
        { _id: req.body.followedUser },
        {
          $push: { followings: req.body.followUser },
        }
      );
      await User.updateOne(
        { _id: req.body.followUser },
        {
          $push: { followers: req.body.followedUser },
        }
      );
    }

    const user = await User.findOne({ _id: req.body.followedUser });
    const followedUser = await User.findOne({ _id: req.body.followUser });
    res.status(200).json({
      user: user,
      followedUser: followedUser,
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.searchPosts = async (req, res) => {
  try {
    const resultPosts = await Post.find({
      ...(req.query.searchQuery && {
        $or: [
          {
            content: { $regex: req.query.searchQuery, $options: "i" },
          },
        ],
      }),
    });

    const resultUsers = await User.find({
      ...(req.query.searchQuery && {
        $or: [
          {
            username: { $regex: req.query.searchQuery, $options: "i" },
          },
        ],
      }),
    });

    res.status(200).json({
      posts: resultPosts,
      users: resultUsers,
    });
  } catch (error) {}
};
