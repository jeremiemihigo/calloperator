const ModelProjet = require("../../Models/Portofolio/PProjet");
const { generateNumber } = require("../../Static/Static_Function");
const ModelQuestion = require("../../Models/Portofolio/PQuestion");
const ModelFeedback = require("../../Models/Portofolio/PFeedback");
const asyncLab = require("async");
const _ = require("lodash");
const moment = require("moment");

const AddProjet = async (req, res) => {
  try {
    //savedBy, id
    const id = `P${generateNumber(5)}`;
    const { codeAgent } = req.user;
    const { title, intervenant, idFormulaire } = req.body;
    if (!title || !intervenant || !idFormulaire) {
      return res.status(404).json("Veuillez renseigner les champs");
    }
    ModelProjet.create({
      title,
      savedBy: codeAgent,
      id,
      intervenant,
      idFormulaire,
    })
      .then((result) => {
        if (result) {
          return res.status(200).json(result);
        } else {
          return res.status(404).json("Error");
        }
      })
      .catch(function (error) {
        return res.status(404).json("Error " + error.message);
      });
  } catch (error) {
    return res.status(404).json("Error " + error.message);
  }
};
const ReadProjet = async (req, res) => {
  try {
    const { fonction, codeAgent } = req.user;
    let match = fonction === "superUser" ? {} : { intervenant: codeAgent };
    ModelProjet.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "agentadmins",
          localField: "intervenant",
          foreignField: "codeAgent",
          as: "agents",
        },
      },
      {
        $lookup: {
          from: "pdatabases",
          localField: "id",
          foreignField: "idProjet",
          as: "database",
        },
      },
      {
        $lookup: {
          from: "pfeedback_calls",
          localField: "id",
          foreignField: "idProjet",
          as: "feedback",
        },
      },
      {
        $lookup: {
          from: "pformulaires",
          localField: "idFormulaire",
          foreignField: "idFormulaire",
          as: "formulaire",
        },
      },
      { $unwind: "$formulaire" },
      {
        $lookup: {
          from: "pquestions",
          localField: "idFormulaire",
          foreignField: "idFormulaire",
          as: "questions",
        },
      },
      {
        $project: {
          feedback: 1,
          database: 1,
          formulaire: 1,
          id: 1,
          agents: 1,
          idFormulaire: 1,
          questions: 1,
          title: 1,
        },
      },
    ]).then((result) => {
      return res.status(200).json(result.reverse());
    });
  } catch (error) {
    return res.status(404).json("Error " + error.message);
  }
};
const RapportPortofolio = async (req, res) => {
  try {
    const { debut, fin, idFormulaire, idProjet } = req.body;

    if (debut === "" || fin === "" || !idFormulaire || !idProjet) {
      return res.status(201).json("Veuillez renseigner les dates et le projet");
    }
    asyncLab.waterfall(
      [
        function (done) {
          ModelQuestion.find(
            { idFormulaire },
            { question: 1, id: 1, valueSelect: 1 }
          )
            .lean()
            .then((questions) => {
              if (questions.length > 0) {
                done(null, questions);
              }
            })
            .catch(function (err) {
              console.log(err);
            });
        },
        function (questions, done) {
          let tablequestion = [];
          for (let i = 0; i < questions.length; i++) {
            tablequestion.push({
              title: questions[i].question,
              id: questions[i].id,
            });
            if (
              questions[i].valueSelect.length > 0 &&
              questions[i].valueSelect.filter(
                (x) => x.next_question !== "" && x !== undefined
              ).length > 0
            ) {
              for (
                let y = 0;
                y <
                questions[i].valueSelect.filter(
                  (x) => x.next_question !== "" && x !== undefined
                ).length;
                y++
              ) {
                const { next_question, id } = questions[i].valueSelect.filter(
                  (x) => x.next_question !== "" && x !== undefined
                )[y];
                tablequestion.push({ title: next_question, id, i: "next" });
              }
            }
          }
          done(null, tablequestion);
        },
        function (questions, done) {
          const beginDate = new Date(debut).getTime();
          const endDate = new Date(fin).getTime();
          ModelFeedback.find({
            dateSave: { $gte: beginDate, $lte: endDate },
            idProjet,
          })
            .then((result) => {
              done(null, questions, result);
            })
            .catch(function (err) {
              return res.status(201).json("Error");
            });
        },
        function (questions, resultat, done) {
          let table = [];
          let tablefinal = [];
          const returnReponse = (questio, feedback) => {
            if (_.filter(feedback, { idQuestion: questio }).length > 0) {
              return _.filter(feedback, {
                idQuestion: questio,
              })[0].reponse.join(",");
            } else {
              return "";
            }
          };
          for (let i = 0; i < resultat.length; i++) {
            table.push({
              codeclient: resultat[i].codeclient,
              contact: resultat[i].contact,
              agent: resultat[i].agent,
              shop: resultat[i].shop,
              region: resultat[i].region,
              dateSave: moment(new Date(resultat[i].dateSave)).format(
                "YYYY-MM-DD"
              ),
              type: resultat[i].type,
              status: resultat[i].status,
              date_to_recall:
                resultat[i].date_to_recall > 0
                  ? moment(new Date(resultat[i].date_to_recall)).format(
                      "YYYY-MM-DD"
                    )
                  : "",
            });
            for (let y = 0; y < questions.length; y++) {
              let { title, id } = questions[y];
              table[0]["" + title] = returnReponse(id, resultat[i].feedback);
            }
            tablefinal.push(table[0]);
            table = [];
          }
          done(tablefinal);
        },
      ],
      function (result) {
        return res.status(200).json(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const AnalyseToDay = async (req, res) => {
  try {
    const today = new Date(moment(new Date()).format("YYYY-MM-DD")).getTime();
    const { nom } = req.user;
    const result = await ModelFeedback.find(
      {
        dateSave: today,
        agent: nom,
      },
      { type: 1 }
    );
    return res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = { AddProjet, AnalyseToDay, RapportPortofolio, ReadProjet };
