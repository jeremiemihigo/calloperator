const ModelProjet = require("../../Models/Portofolio/PProjet");
const ModelFeedback = require("../../Models/Portofolio/PFeedback");
const asyncLab = require("async");
const _ = require("lodash");
const moment = require("moment");
const ModelCorbeille = require("../../Models/Corbeille");

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
    const { debut, fin } = req.body;

    if (debut === "" || fin === "") {
      return res.status(201).json("Veuillez renseigner les dates et le projet");
    }
    let title = [
      {
        id: "text",
        title:
          "Bonjour Monsieur/ Madame, je suis .......... du service client de BBOXX, nous voulons savoir si le materiel de BBOXX fonctionne bien chez vous ?",
        value: "fonctionne",
      },
      {
        id: "text",
        title:
          "Si Non, pourriez vous nous dire si ça ne fonctionne pas bien pourquoi?",
        value: "sinon_texte",
      },
      {
        id: "date",
        title:
          "Vu que votre système est désactivé vous comptez vous réactiver quel jour?",
        value: "sinon_date",
      },
      {
        id: "texte",
        title:
          "Si tout va bien chez vous, Monsieur / Madame, nous aurons besoin de savoir la raison du non-paiement de votre Kit solaire BBOXX.",
        value: "sioui_texte",
      },
      {
        id: "date",
        title: "Et vous comptez vous réactiver quand?",
        value: "sioui_date",
      },
    ];

    asyncLab.waterfall(
      [
        function (done) {
          ModelCorbeille.create({
            name: req.user.nom,
            texte: `Rapport Portefeuille allant du ${debut} au ${fin}`,
            date: moment(new Date()).format("DD-MM-YYYY"),
          })
            .then((result) => {
              done(null, result);
            })
            .catch(function (error) {
              done(null, true);
            });
        },
        function (resul, done) {
          const beginDate = new Date(debut).getTime();
          const endDate = new Date(fin).getTime();
          ModelFeedback.find({
            dateSave: { $gte: beginDate, $lte: endDate },
          })
            .then((result) => {
              done(null, result);
            })
            .catch(function (err) {
              return res.status(201).json("Error " + err.message);
            });
        },
        function (resultat, done) {
          let table = [];
          let tablefinal = [];

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
            for (let y = 0; y < title.length; y++) {
              table[0]["" + title[y].title] =
                title[y].id === "date"
                  ? resultat[i][title[y].value] > 0
                    ? moment(new Date(resultat[i][title[y].value])).format(
                        "YYYY-MM-DD"
                      )
                    : 0
                  : resultat[i][title[y].value];
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
module.exports = { AnalyseToDay, RapportPortofolio, ReadProjet };
