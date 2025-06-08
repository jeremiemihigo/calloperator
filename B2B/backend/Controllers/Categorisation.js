const ModelCategorie = require("../Models/CategoriProjet");
const { generateString } = require("../static/fonction");
const ModelProjet = require("../Models/Projet");
const asyncLab = require("async");

const AddCategorisation = async (req, res) => {
  try {
    const { title } = req.body;
    const id = generateString(10);
    ModelCategorie.create({ title, id })
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
const ReadCategorisation = async (req, res) => {
  try {
    ModelCategorie.find({})
      .lean()
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
const EditCategorisation = async (req, res) => {
  try {
    const { id, title } = req.body;
    if (!id || !title) {
      return res.status(404).json("Veuillez renseigner les champs");
    }
    ModelCategorie.findOneAndUpdate({ id }, { $set: { title } }, { new: true })
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
const DeleteCategorisation = async (req, res) => {
  try {
    const { id } = req.body;
    asyncLab.waterfall(
      [
        function (done) {
          ModelProjet.find({ idCategorie: id })
            .lean()
            .then((result) => {
              if (result.length > 0) {
                return res
                  .status(404)
                  .json(
                    `Veuillez supprimer les projets attachés à cette catégorie`
                  );
              } else {
                done(null, true);
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        function (r, done) {
          ModelCategorie.findOneAndDelete({ id })
            .then((result) => {
              done(result);
            })
            .catch(function (error) {
              return res.status(404).json(error.message);
            });
        },
      ],
      function (result) {
        if (result) {
          return res.status(200).json(id);
        } else {
          return res.status(404).json("Error");
        }
      }
    );
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

module.exports = {
  AddCategorisation,
  DeleteCategorisation,
  ReadCategorisation,
  EditCategorisation,
};
