const ModelEtapes = require("../Models/Etapes");
const { generateString } = require("../static/fonction");

const AddEtape = async (req, res) => {
  try {
    const { title, concerne, deedline } = req.body;
    if (!title || !concerne || !deedline) {
      return res.status(404).json("Veuillez renseigner les champs");
    }
    const id = generateString(6);
    ModelEtapes.create({ title, concerne, id, deedline })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch(function (error) {
        return res.status(200).json(error.message);
      });
  } catch (error) {
    return res.status(200).json(error.message);
  }
};
const ReadAllEtape = async (req, res) => {
  try {
    ModelEtapes.find({})
      .lean()
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
module.exports = { AddEtape, ReadAllEtape };
