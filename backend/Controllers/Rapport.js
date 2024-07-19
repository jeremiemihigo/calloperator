const modelRapport = require("../Models/Rapport");
const modelAppel = require("../Models/Issue/Appel");

module.exports = {
  Rapport: (req, res) => {
    try {
      const { debut, fin, dataTosearch } = req.body;

      if (!debut || !fin) {
        return res
          .status(200)
          .json({ error: true, message: "Veuillez renseigner les dates" });
      }
      let match = dataTosearch
        ? {
            dateSave: {
              $gte: new Date(debut),
              $lte: new Date(fin),
            },
            [dataTosearch.key]: dataTosearch.value,
          }
        : {
            dateSave: {
              $gte: new Date(debut),
              $lte: new Date(fin),
            },
          };

      const project = {
        codeclient: 1,
        codeCu: 1,
        clientStatut: 1,
        PayementStatut: 1,
        consExpDays: 1,
        idDemande: 1,
        dateSave: 1,
        codeAgent: 1,
        nomClient: 1,
        idZone: 1,
        idShop: 1,
        "agentSave.nom": 1,
        "demandeur.nom": 1,
        "demandeur.codeAgent": 1,
        "demandeur.fonction": 1,
        "demande.typeImage": 1,
        "demande.createdAt": 1,
        "demande.numero": 1,
        "demande.commune": 1,
        "demande.updatedAt": 1,
        "demande.statut": 1,
        "demande.sector": 1,
        "demande.lot": 1,
        "demande.cell": 1,
        "demande.reference": 1,
        "demande.sat": 1,
        "demande.raison": 1,
        "coordonnee.longitude": 1,
        "coordonnee.latitude": 1,
        "coordonnee.altitude": 1,
        createdAt: 1,
        updatedAt: 1,
        adresschange: 1,
      };
      modelRapport
        .find(match, project)
        .lean()
        .then((response) => {
          return res.status(200).json(response.reverse());
        })
        .catch(function (err) {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  },
  IssueRapport: (req, res) => {
    try {
      console.log(req.body);
      const { debut, fin, valueSelect } = req.body;

      if (!debut || !fin) {
        return res
          .status(200)
          .json({ error: true, message: "Veuillez renseigner les dates" });
      }
      let match = {
        dateSave: {
          $gte: new Date(debut),
          $lte: new Date(fin),
        },
        statut: valueSelect,
      };

      modelAppel
        .find(match)
        .lean()
        .then((response) => {
          return res.status(200).json(response.reverse());
        })
        .catch(function (err) {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  },
};
