const ModelAction = require("../Models/Actions");
const ModelProjet = require("../Models/Projet");
const moment = require("moment");
const { generateString, differenceDays } = require("../static/fonction");
const asyncLab = require("async");

const AddAction = async (req, res, next) => {
  try {
    const { action, concerne, next_step, statut_actuel } = req.body;
    const today = moment(new Date()).format("YYYY-MM-DD");
    if (!action || !concerne || !next_step || !statut_actuel) {
      return res.status(201).json("Veuillez renseigner les champs");
    }
    const { name } = req.user;
    asyncLab.waterfall([
      function (done) {
        ModelProjet.aggregate([
          { $match: { id: concerne } },
          {
            $lookup: {
              from: "etapes",
              localField: "next_step",
              foreignField: "id",
              as: "etape",
            },
          },
          {
            $lookup: {
              from: "actions",
              localField: "id",
              foreignField: "concerne",
              as: "action",
            },
          },
          {
            $addFields: {
              derniereAction: {
                $arrayElemAt: [{ $reverseArray: "$action" }, 0],
              },
            },
          },
          { $unwind: "$etape" },
        ])
          .then((projet) => {
            if (projet[0].derniereAction) {
              const deedline =
                projet[0].etape.deedline -
                  differenceDays(projet[0].derniereAction.dateSave, today) >
                0
                  ? "IN SLA"
                  : "OUT SLA";

              done(null, projet[0].derniereAction, deedline);
            } else {
              const deedline =
                projet[0].etape.deedline -
                  differenceDays(
                    moment(projet[0].createdAt).format("YYYY-MM-DD"),
                    today
                  ) >
                0
                  ? "IN SLA"
                  : "OUT SLA";

              done(null, projet[0].derniereAction, deedline);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      function (projet, deedline, done) {
        if (projet) {
          ModelAction.findByIdAndUpdate(projet._id, {
            $set: {
              deedline,
            },
          })
            .then((result) => {
              done(null, result);
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          done(null, projet);
        }
      },
      function (projet, done) {
        ModelAction.create({
          action,
          concerne,
          next_step,
          savedBy: name,
          statut_actuel,
          dateSave: today,
        })
          .then((result) => {
            req.recherche = concerne;
            next();
          })
          .catch(function (error) {
            return res.status(201).json("" + error.message);
          });
      },
    ]);
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
    const { designation, description, next_step } = req.body;
    if (!designation || !description || !next_step) {
      return res.status(404).json("Veuillez renseigner les champs");
    }
    const id = generateString(7);
    ModelProjet.create({ designation, description, next_step, id })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch(function (error) {
        return res.status(404).json("" + error.message);
      });
  } catch (error) {
    return res.status(404).json("" + error.message);
  }
};
const ReadProjet = async (req, res) => {
  try {
    const { id } = req.params;
    let match = id === "all" ? { $match: {} } : { $match: { id } };
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
module.exports = { AddAction, EditAction, AddProjet, ReadProjet };
