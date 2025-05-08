const ModelProspect = require("../Models/Prospect");
const { generateString } = require("../static/fonction");

const AddProspect = async (req, res) => {
  try {
    const { name, projet, description, next_step } = req.body;
    if (!name || !description || !next_step) {
      return res.status(404).json("Veuillez renseigner les champs obligatoire");
    }
    const id = generateString(7);
    ModelProspect.create({
      name,
      projet,
      id,
      description,
      next_step,
      savedBy: req.user.name,
    })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch(function (error) {
        return res.status(404).json(error.message);
      });
  } catch (error) {
    return res.status(404).json(error.message);
  }
};
const ReadProspect = async (req, res) => {
  try {
    const { id } = req.params;
    let match = id === "all" ? { $match: {} } : { $match: { id } };
    let match1 = req.recherche ? { $match: { id: req.recherche } } : match;

    ModelProspect.aggregate([
      match1,
      {
        $lookup: {
          from: "actions",
          localField: "id",
          foreignField: "concerne",
          as: "actions",
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "projet",
          foreignField: "id",
          as: "projet",
        },
      },
      {
        $lookup: {
          from: "commentaires",
          localField: "id",
          foreignField: "concerne",
          as: "commentaire",
        },
      },
    ])
      .then((result) => {
        let returne = req.recherche ? result[0] : result.reverse();
        return res.status(200).json(returne);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {}
};
const ReadProspectBy = async (req, res) => {
  try {
    const { data } = req.body;
    ModelProspect.aggregate([
      { $match: data },
      {
        $lookup: {
          from: "actions",
          localField: "id",
          foreignField: "concerne",
          as: "actions",
        },
      },
    ])
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};
const EditProspect = async (req, res) => {
  try {
    const { id, data } = req.body;
    if (!id || !data) {
      return res.status(404).json("Error");
    }
    ModelProspect.findOneAndUpdate({ id }, { $set: data }, { new: true })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch(function (error) {
        return res.status(404).json(error.message);
      });
  } catch (error) {
    return res.status(404).json(error.message);
  }
};
module.exports = { AddProspect, EditProspect, ReadProspectBy, ReadProspect };
