const ModelAction = require("../Models/Actions");
const ModelProjet = require("../Models/Projet");
const moment = require("moment");
const ModelCout = require("../Models/Cout");
const { generateString, differenceDays } = require("../static/fonction");
const asyncLab = require("async");

const AddAction = async (req, res, next) => {
  try {
    const {
      action,
      concerne,
      commentaire,
      deedline,
      cout,
      next_step,
      statut_actuel,
    } = req.body;
    const idAction = new Date().getTime();
    const couts = cout.map((index) => {
      return {
        ...index,
        savedby: req.user.name,
        concerne,
        idAction,
      };
    });

    const today = moment(new Date()).format("YYYY-MM-DD");
    if (!action || !concerne || !next_step || !statut_actuel || !deedline) {
      return res.status(201).json("Veuillez renseigner les champs");
    }
    const { name } = req.user;
    asyncLab.waterfall(
      [
        function (done) {
          ModelAction.create({
            action,
            id: idAction,
            concerne,
            next_step,
            savedBy: name,
            statut_actuel,
            dateSave: today,
            commentaire,
            deedline,
          })
            .then((result) => {
              done(null, result);
            })
            .catch(function (error) {
              return res.status(201).json("" + error.message);
            });
        },
        function (result, done) {
          if (couts && couts.length > 0) {
            ModelCout.insertMany(couts)
              .then((reponse) => {
                done(reponse);
              })
              .catch(function (err) {
                console.log(err);
                done(result);
              });
          } else {
            done(result);
          }
        },
      ],
      function (result) {
        req.recherche = concerne;
        next();
      }
    );
  } catch (error) {
    return res.status(201).json("" + error.message);
  }
};
const EditAction = async (req, res) => {
  try {
    const { action, id, concerne, next_step, statut_actuel } = req.body;
    if (!action || !concerne || !next_step || !statut_actuel) {
      return res.status(201).json("Veuillez renseigner les champs");
    }
    ModelAction.findByIdAndUpdate(
      id,
      {
        $set: {
          action,
          concerne,
          next_step,
          statut_actuel,
        },
      },
      { new: true }
    ).then((result) => {
      return res.status(200).json(result);
    });
  } catch (error) {
    return res.status(201).json(error.message);
  }
};
const AddProjet = async (req, res) => {
  try {
    const {
      designation,
      deedline,
      responsable,
      email,
      adresse,
      contact,
      suivi_par,
      description,
      idCategorie,
      next_step,
    } = req.body;
    if (
      !designation ||
      !description ||
      !next_step ||
      !responsable ||
      !suivi_par ||
      !idCategorie ||
      !deedline
    ) {
      return res.status(201).json("Veuillez renseigner les champs");
    }
    const id = generateString(7);
    ModelProjet.create({
      designation,
      responsable,
      email,
      adresse,
      contact,
      idCategorie,
      deedline,
      suivi_par,
      description,
      next_step,
      id,
    })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch(function (error) {
        return res.status(201).json("" + error.message);
      });
  } catch (error) {
    return res.status(201).json("" + error.message);
  }
};
const ReadProjet = async (req, res) => {
  try {
    const { data } = req.body;
    let match = data === "all" ? { $match: {} } : { $match: data };
    let match1 = req.recherche ? { $match: { id: req.recherche } } : match;
    ModelProjet.aggregate([
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
          from: "prospects",
          localField: "id",
          foreignField: "projet",
          as: "prospects",
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
      {
        $lookup: {
          from: "couts",
          localField: "id",
          foreignField: "concerne",
          as: "cout",
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
const ReadDepense = async (req, res) => {
  try {
    const { concerne } = req.params;
    console.log(concerne);
    ModelCout.aggregate([
      { $match: { concerne } },
      {
        $lookup: {
          from: "actions",
          localField: "idAction",
          foreignField: "id",
          as: "action",
        },
      },
      { $unwind: "$action" },
    ]).then((result) => {
      return res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
  }
};
const CloseAction = async (req, res, next) => {
  try {
    const { id } = req.body;
    ModelAction.findByIdAndUpdate(
      id,
      { $set: { type: "CLOSE" } },
      { new: true }
    )
      .then((result) => {
        console.log(result);
        req.recherche = result.concerne;
        next();
      })
      .catch(function (error) {
        return res.status(201).json(error);
      });
  } catch (error) {}
};
const ReadOpenAction = async (req, res) => {
  try {
    ModelAction.aggregate([
      { $match: { type: "OPEN" } },
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
    ])
      .then((result) => {
        return res.status(200).json(result.reverse());
      })
      .catch(function (err) {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  AddAction,
  CloseAction,
  ReadDepense,
  EditAction,
  AddProjet,
  ReadProjet,
  ReadOpenAction,
};
