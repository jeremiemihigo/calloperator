const ModelFeedback = require("../../Models/Portofolio/PFeedback");
const moment = require("moment");

const AddFeedback = async (req, res) => {
  try {
    const { nom } = req.user;
    const io = req.io;
    const {
      codeclient,
      sioui_texte,
      sioui_date,
      unreachable_feedback,
      sinon_date,
      sinon_texte,
      fonctionne,
      raison_rappel,
      shop,
      region,
      type,
      status,
      date_to_recall,
      contact,
    } = req.body;
    let rappel = date_to_recall ? new Date(date_to_recall).getTime() : 0;
    const month = moment(new Date()).format("MM-YYYY");
    if (
      !codeclient ||
      !type ||
      !status ||
      !contact ||
      !shop ||
      !region ||
      fonctionne === ""
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
      month,
      sioui_texte,
      unreachable_feedback,
      sioui_date: sioui_date !== "" ? new Date(sioui_date).getTime() : 0,
      sinon_date: sinon_date !== "" ? new Date(sinon_date).getTime() : 0,
      sinon_texte,
      fonctionne,
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
        if (
          result.type !== "Remind" &&
          result.sioui_texte !== "Promesse de paiement"
        ) {
          io.emit("portofolio", result.type.toLocaleLowerCase());
          return res.status(200).json(result);
        } else {
          return res.status(200).json(result);
        }
      })
      .catch(function (error) {
        return res.status(201).json("" + error.message);
      });
  } catch (error) {
    return res.status(201).json("" + error.message);
  }
};

module.exports = { AddFeedback };
