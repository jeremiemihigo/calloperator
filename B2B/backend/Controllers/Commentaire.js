const ModelCommentaire = require("../Models/Commentaire");

const AddVue = async (req, res) => {
  try {
    const { username } = req.user;
    const { concerne } = req.params;
    ModelCommentaire.updateMany(
      { concerne },
      {
        $addToSet: {
          vu: username,
        },
      }
    ).then((result) => {
      console.log(result);
    });
  } catch (error) {
    console.log(error);
  }
};
const ReadCommentaire = async (req, res) => {
  try {
    const { username } = req.user;
    ModelCommentaire.aggregate([
      { $match: { vu: { $nin: [username] } } },
      {
        $lookup: {
          from: "projects",
          localField: "concerne",
          foreignField: "id",
          as: "projet",
        },
      },
      {
        $lookup: {
          from: "prospects",
          localField: "concerne",
          foreignField: "id",
          as: "prospect",
        },
      },
      { $limit: 10 },
    ]).then((result) => {
      return res.status(200).json(result.reverse());
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  AddVue,
  ReadCommentaire,
};
