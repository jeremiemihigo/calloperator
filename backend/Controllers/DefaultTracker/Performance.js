const asyncLab = require("async");
const ModelMessage = require("../../Models/DefaultTracker/Message");

const SendMessage = async (req, res) => {
  try {
    const { values, agents } = req.body;

    if (!values || !agents || agents.length === 0) {
      return res.status(201).json("Error");
    }
    asyncLab.waterfall(
      [
        function (done) {
          //je cherche les éléments qui ont été mentionnés
          let split = values.split(" ");
          let mentions = [];
          for (let i = 0; i < split.length; i++) {
            if (split[i].startsWith("@")) {
              mentions.push(split[i].split("@")[1]);
            }
          }
          done(null, mentions, split);
        },
        function (mention, message, done) {
          const returnValue = (agent, text) => {
            if (mention.includes(text)) {
              return agent["" + text];
            } else {
              return text;
            }
          };
          let table = [];
          let final = [];
          for (let i = 0; i < agents.length; i++) {
            for (let y = 0; y < message.length; y++) {
              if (message[y].split("@")[1]) {
                table.push(returnValue(agents[i], message[y].split("@")[1]));
              } else {
                table.push(message[y]);
              }
            }

            final.push({
              concerne: agents[i].codeAgent,
              message: table.join(" "),
              savedby: req.user.nom,
            });
            table = [];
          }
          done(null, final);
        },
        function (donner, done) {
          ModelMessage.insertMany(donner)
            .then((result) => {
              done(result);
            })
            .catch(function (error) {
              return res.status(201).json(error.message);
            });
        },
      ],
      function (result) {
        if (result) {
          return res.status(200).json(result);
        } else {
          return res.status(201).json("Error");
        }
      }
    );
  } catch (error) {
    return res.status(201).json(error.message);
  }
};
const ReadMessageAgent = async (req, res) => {
  const { codeAgent } = req.user;
  asyncLab.waterfall(
    [
      function (done) {
        ModelMessage.find({ concerne: codeAgent })
          .lean()
          .then((result) => {
            done(null, result);
          })
          .catch(function (error) {
            return res.status(201).json(error.message);
          });
      },
      function (resultat, done) {
        ModelMessage.updateMany(
          { vu: false, concerne: codeAgent },
          { $set: { vu: true } }
        )
          .then((result) => {
            done(resultat);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
    ],
    function (result) {
      return res.status(200).json(result.reverse());
    }
  );
};

module.exports = {
  SendMessage,
  ReadMessageAgent,
};
