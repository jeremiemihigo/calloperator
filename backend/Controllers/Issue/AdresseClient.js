const modelRapport = require("../../Models/Rapport");

module.exports = {
  updatedAdresse: (req, res) => {
    try {
      const { id, valeur, idPlainte } = req.body;
      if (!id || !valeur || !idPlainte) {
        return res.status(201).json("Error");
      }
      modelRapport
        .findByIdAndUpdate(
          id,
          {
            $set: {
              confirmeAdresse: {
                value: valeur,
                idPlainte,
              },
            },
          },
          { new: true }
        )
        .then((result) => {
          if (result) {
            return res.status(200).json(result);
          } else {
            return res.status(201).json("please try again");
          }
        })
        .catch(function (err) {
          return res.status(201).json("Error " + err);
        });
    } catch (error) {
      console.log(error);
    }
  },
};
