const ModelAction = require("../Models/Actions");
const ModelProspect = require("../Models/Prospect");
const { generateString } = require("../static/fonction");
const asyncLab = require("async");

const AddProspect = async (req, res) => {
  try {
    console.log(req.body);
    const {
      name,
      projet,
      contact,
      suivi_par,
      deedline,
      adresse,
      email,
      description,
      next_step,
    } = req.body;

    if (!name || !description || !next_step || !deedline) {
      return res.status(404).json("Veuillez renseigner les champs obligatoire");
    }
    const id = generateString(7);
    ModelProspect.create({
      name,
      projet,
      deedline,
      id,
      description,
      next_step,
      savedBy: req.user.name,
      contact,
      suivi_par,
      adresse,
      email,
    })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch(function (error) {
        console.log(error);
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
    ModelProspect.findByIdAndUpdate(id, { $set: data }, { new: true })
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
const DeleteProspect = async (req, res) => {
  try {
    const { id } = req.body;
    const returnMessage = (a) => {
      if (a === 1) {
        return "Une action est attachée à ce projet";
      } else {
        return `${a} actions sont attachées à ce projet`;
      }
    };
    asyncLab.waterfall(
      [
        function (done) {
          ModelAction.find({ concerne: id })
            .lean()
            .then((action) => {
              if (action.length > 0) {
                return res.status(404).json(returnMessage(action.length));
              } else {
                done(null, true);
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        function (r, done) {
          ModelProspect.findOneAndDelete({ id })
            .then((result) => {
              done(result);
            })
            .catch(function (error) {
              return res.status(404).json(error.message);
            });
        },
      ],
      function (result) {
        return res.status(200).json(id);
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  AddProspect,
  DeleteProspect,
  EditProspect,
  ReadProspectBy,
  ReadProspect,
};
