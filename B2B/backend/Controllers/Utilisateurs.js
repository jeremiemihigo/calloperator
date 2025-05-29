const ModelUtilisateur = require("../Models/Utilisateurs");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const AddUser = async (req, res) => {
  try {
    const { name, username, permission } = req.body;
    const password = "1234";
    if (!name || !username || !permission) {
      return res.status(404).json("Veuillez renseigner les champs");
    }
    ModelUtilisateur.create({ name, username, permission, password })
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
const DeleteUser = async (req, res) => {
  try {
    ModelUtilisateur.findOneAndDelete({ username: req.body.username }).then(
      (result) => {
        return res.status(200).json(result);
      }
    );
  } catch (error) {}
};
const ReadAllUser = async (req, res) => {
  try {
    ModelUtilisateur.find({}, { password: 0 })
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
const LoginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(201).json("Veuillez renseigner les champs");
  }
  try {
    //const user = await Model_User.aggregate([ look])
    const user = await ModelUtilisateur.findOne({
      username,
      active: true,
    }).select("+password");
    if (!user) {
      return res.status(201).json("Accès non autorisée");
    }

    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      return res.status(201).json("Accès non autorisée");
    }
    sendToken(user, 200, res);
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};
const ResetPassword = (req, res, next) => {
  try {
    const { id } = req.body;

    bcrypt.hash("1234", 10, function (err, bcrypePassword) {
      ModelUtilisateur.findByIdAndUpdate(
        id,
        { $set: { password: bcrypePassword, first: true } },
        { new: true }
      )
        .then((response) => {
          return res.status(200).json("Done");
        })
        .catch(function (err) {
          return res.status(201).json(err.message);
        });
    });
  } catch (error) {
    return res.status(201).json(error.message);
  }
};
const readUserConnect = (req, res) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (token === "null") {
      return res.status(404).json("token_expired");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(404).json("token_expired");
    }

    ModelUtilisateur.findOne(
      { _id: new ObjectId(decoded.id), active: true },
      { name: 1, permission: 1, first: 1, username: 1 }
    )
      .then((response) => {
        if (response) {
          return res.status(200).json(response);
        } else {
          return res.status(404).json("token_expired");
        }
      })
      .catch(function (err) {
        return res.status(404).json("token_expired");
      });
  } catch (error) {}
};
const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  return res.status(statusCode).json(token);
};
module.exports = {
  AddUser,
  readUserConnect,
  DeleteUser,
  LoginUser,
  ResetPassword,
  ReadAllUser,
};
