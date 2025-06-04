// third-party
import { combineReducers } from "redux";

// project import

// import action from "../../Redux/actions";
// import communiquer from "../../Redux/Documentation";
import alluser from "../../Redux/AllUser";
import user from "../../Redux/Utilisateur";
import action from "../../Redux/action";
import categorie from "../../Redux/categorisation";
import prospect from "../../Redux/prospect";

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  user,
  categorie,
  alluser,
  prospect,
  action,
});

export default reducers;
