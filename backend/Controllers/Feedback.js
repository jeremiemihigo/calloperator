const ModelFeedback = require("../Models/Feedback");
const { generateString } = require("../Static/Static_Function");

const AddFeedback = async (req, res) => {
  try {
    const { title, nextFeedback, plateforme } = req.body;
    const { nom } = req.user;
    if (!title || !plateforme) {
      return;
    }
    ModelFeedback.create({
      title,
      plateforme,
      nextFeedback,
      id: generateString(5),
      savedby: nom,
    })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch(function (error) {
        return res.status(201).json("Error " + error.message);
      });
  } catch (error) {
    return res.status(201).json("Error " + error.message);
  }
};
const ReadFeedback = async (req, res) => {
  try {
    const { plateforme } = req.params;

    const filter = plateforme === "all" ? ["vm", "portofolio"] : [plateforme];
    ModelFeedback.aggregate([
      { $match: { plateforme: { $in: filter } } },
      {
        $lookup: {
          from: "tfeedbacks",
          localField: "nextFeedback",
          foreignField: "idFeedback",
          as: "feeddt",
        },
      },
      { $project: { title: 1, plateforme: 1, feeddt: 1, id: 1, savedBy: 1 } },
    ])
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch(function (error) {
        console.log(error);
        return res.status(404).json("Error " + error.message);
      });
  } catch (error) {
    console.log(error);
  }
};
const EditFeedbackVmPortofolio = async (req, res) => {
  try {
    const { title, plateforme, id } = req.body;
    ModelFeedback.findOneAndUpdate(
      { id },
      {
        $set: {
          title,
          plateforme,
        },
      },
      { new: true }
    )
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch(function (err) {
        return res.status(400).json(err.message);
      });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
module.exports = { AddFeedback, ReadFeedback, EditFeedbackVmPortofolio };
