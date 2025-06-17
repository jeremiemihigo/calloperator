// third-party
import { combineReducers } from "redux";

// project import

// import action from "../../Redux/actions";
// import communiquer from "../../Redux/Documentation";
import alluser from "../../Redux/AllUser";
import user from "../../Redux/Utilisateur";
import action from "../../Redux/action";
import categorie from "../../Redux/categorisation";
import commentaire from "../../Redux/commentaire";

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  user,
  categorie,
  alluser,
  action,
  commentaire,
});

export default reducers;
