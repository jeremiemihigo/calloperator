const ModelFeedback = require("../Models/Feedback");

const AddFeedback = async (req, res) => {
  try {
    const {
      title,
      incharge,
      suivisuperuser,
      verification,
      torefresh,
      isAction,
      plateforme,
      typecharge,
    } = req.body;
    const { nom } = req.user;
    if (!title || !plateforme || incharge.length === 0 || !typecharge) {
      return res.status(201).json("Veuillez renseigner les champs");
    }
    ModelFeedback.create({
      title,
      plateforme,
      suivisuperuser,
      idFeedback: new Date().getTime(),
      idRole: incharge,
      verification,
      savedby: nom,
      torefresh,
      isAction,
      typecharge,
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
        $lookup: {
          from: "postes",
          localField: "idRole",
          foreignField: "id",
          as: "postes",
        },
      },
      {
        $project: {
          title: 1,
          postes: 1,
          plateforme: 1,
          idRole: 1,
          role: 1,
          idFeedback: 1,
          savedby: 1,
          typecharge: 1,
          verification: 1,
          suivisuperuser: 1,
          isAction: 1,
          torefresh: 1,
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
