const ModelCategorie = require("../Models/CategoriProjet");
const { generateString } = require("../static/fonction");

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
module.exports = { AddCategorisation, ReadCategorisation, EditCategorisation };
