const ModelFeedback = require("../../Models/Portofolio/PFeedback");
const moment = require("moment");

const AddFeedback = async (req, res) => {
  try {
    const { nom } = req.user;
    const {
      codeclient,
      idProjet,
      feedback,
      raison_rappel,
      shop,
      region,
      type,
      status,
      date_to_recall,
      contact,
    } = req.body;
    let rappel = date_to_recall ? new Date(date_to_recall).getTime() : 0;
    if (
      !codeclient ||
      !type ||
      !status ||
      !contact ||
      !idProjet ||
      !shop ||
      !region
    ) {
      return res
        .status(201)
        .json("Veuillez renseigner les champs ayant l'asterisque");
    }
    const dateSave = new Date(
      moment(new Date()).format("YYYY-MM-DD")
    ).getTime();
    ModelFeedback.create({
      codeclient,
      idProjet,
      feedback,
      agent: nom,
      shop,
      raison_rappel,
      region,
      dateSave,
      type,
      status,
      date_to_recall: rappel,
      contact,
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

module.exports = { AddFeedback };
