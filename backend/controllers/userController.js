const User = require("../models/userModel");
const Post = require("../models/postsModel");
const Noti = require("../models/notificationModel");
exports.getUser = async (req, res) => {
  try {
    const rest = await User.findOne({
      ...(req.query.username && { username: req.query.username }),
      ...(req.query.userId && { _id: req.query.userId }),
    });

    const posts = await Post.find({ userId: rest._id, isRepost: false });
    const reposts = await Post.find({ userId: rest._id, isRepost: true });
    res.status(200).json({
      user: rest,
      posts,
      reposts,
    });
  } catch (error) {}
};

exports.updateProfile = async (req, res) => {
  try {
    const resss = await User.findByIdAndUpdate(
      { _id: req.body._id },
      {
        username: req.body.username,
        bio: req.body.bio,
        profile: req.body.profile,
      }
    );

    const ress = await User.findOne({ _id: req.body._id });

    const { password: pass, ...rest } = ress._doc;

    res.status(200).json({
      user: rest,
    });
    // console.log(ress)
  } catch (error) {}
};

exports.getUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.status(200).json(users);
};

exports.updateNotification = async (req, res) => {
  try {
    const ress = new Noti({
      senderId: req.body.senderId,
      receiverId: req.body.receiverId,
      type: req.body.type,
      postId: req.body.postId,
    });
    const saveNoti = await ress.save();
    res.status(200).json(saveNoti);
  } catch (error) {}
};

exports.getNotifications = async (req, res) => {
  try {
    const resData = await Noti.find({ receiverId: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(resData);
  } catch (error) {}
};

exports.savePost = async (req, res) => {
  try {
    const isSaved = await User.find({
      _id: req.body.userId,
      saves: { $in: [req.body.postId] },
    });

    if (isSaved.length > 0) {
      await User.updateOne(
        {
          _id: req.body.userId,
        },
        {
          $pull: { saves: req.body.postId },
        }
      );
    } else {
      await User.updateOne(
        {
          _id: req.body.userId,
        },
        {
          $push: { saves: req.body.postId },
        }
      );
    }
    const user = await User.findOne({ _id: req.body.userId });

    res.status(200).json({
      user,
    });
  } catch (error) {}
};
