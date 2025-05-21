const ModelFeedback = require("../Models/Feedback");

const AddFeedback = async (req, res) => {
  try {
    const { title, id, incharge, plateforme } = req.body;
    const { nom } = req.user;
    if (!title || !plateforme || !id || incharge.length === 0) {
      return;
    }
    ModelFeedback.create({
      title,
      plateforme,
      idFeedback: id,
      idRole: incharge,
      savedby: nom,
    })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch(function (error) {
        console.log(error);
        return res.status(201).json("Error " + error.message);
      });
  } catch (error) {
    return res.status(201).json("Error " + error.message);
  }
};
const ReadFeedback = async (req, res) => {
  try {
    const { plateforme } = req.params;

    const filter =
      plateforme === "all" ? ["vm", "portofolio", "dt"] : [plateforme];
    ModelFeedback.aggregate([
      { $match: { plateforme: { $in: filter } } },
      {
        $lookup: {
          from: "roles",
          localField: "idRole",
          foreignField: "idRole",
          as: "role",
        },
      },
      {
        $project: {
          title: 1,
          plateforme: 1,
          role: 1,
          idFeedback: 1,
          savedBy: 1,
        },
      },
    ])
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch(function (error) {
        return res.status(404).json("Error " + error.message);
      });
  } catch (error) {
    console.log(error);
  }
};
const EditFeedbackVmPortofolio = async (req, res) => {
  try {
    const { data, id } = req.body;
    ModelFeedback.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      { new: true }
    )
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch(function (err) {
        return res.status(201).json(err.message);
      });
  } catch (error) {
    return res.status(201).json(error.message);
  }
};
module.exports = { AddFeedback, ReadFeedback, EditFeedbackVmPortofolio };
