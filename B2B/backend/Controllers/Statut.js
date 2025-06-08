const ModelCommentaire = require("../Models/Commentaire");
const asyncLab = require("async");
const ModelProjet = require("../Models/Projet");
const ModelProspect = require("../Models/Prospect");

const ChangeStatus = async (req, res, next) => {
  try {
    const { statut, commentaire, concerne } = req.body;
    const { name } = req.user;
    if (!statut || !commentaire || !concerne) {
      return res.status(404).json("Veuillez renseigner les champs");
    }
    asyncLab.waterfall(
      [
        function (done) {
          ModelCommentaire.create({
            commentaire,
            doby: name,
            concerne,
            id: new Date().getTime(),
            vu: req.user.username,
          })
            .then((result) => {
              if (result) {
                done(null, result);
              }
            })
            .catch(function (error) {
              return res.status(404).json(error.message);
            });
        },
        function (result, done) {
          ModelProjet.findOneAndUpdate(
            { id: result.concerne },
            { $set: { statut } }
          ).then((resultat) => {
            if (resultat) {
              done(result);
            }
          });
        },
      ],
      function (result) {
        req.recherche = result.concerne;
        next();
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(404).json(error.message);
  }
};
const ChangeStatusProspect = async (req, res, next) => {
  try {
    const { statut, commentaire, concerne } = req.body;
    const { name } = req.user;
    if (!statut || !commentaire || !concerne) {
      return res.status(404).json("Veuillez renseigner les champs");
    }
    asyncLab.waterfall(
      [
        function (done) {
          ModelCommentaire.create({
            commentaire,
            doby: name,
            concerne,
            id: new Date().getTime(),
          })
            .then((result) => {
              if (result) {
                done(null, result);
              }
            })
            .catch(function (error) {
              return res.status(404).json(error.message);
            });
        },
        function (result, done) {
          ModelProspect.findOneAndUpdate(
            { id: result.concerne },
            { $set: { statut } }
          ).then((resultat) => {
            if (resultat) {
              done(result);
            }
          });
        },
      ],
      function (result) {
        req.recherche = result.concerne;
        next();
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(404).json(error.message);
  }
};
const EditCommentaire = async (req, res, next) => {
  try {
    const { id, commentaire } = req.body;
    if (!id || !commentaire) {
      return res.status(404).json("Error");
    }
    ModelCommentaire.findOneAndUpdate(
      { id },
      { $set: { commentaire } },
      { new: true }
    )
      .then((result) => {
        req.recherche = result.concerne;
        next();
      })
      .catch(function (error) {
        return res.status(404).json(error.message);
      });
  } catch (error) {
    return res.status(404).json(error.message);
  }
};
module.exports = { ChangeStatus, ChangeStatusProspect, EditCommentaire };
