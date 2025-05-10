// third-party
import { combineReducers } from "redux";

// project import

// import action from "../../Redux/actions";
// import communiquer from "../../Redux/Documentation";
import alluser from "../../Redux/AllUser";
import user from "../../Redux/Utilisateur";
import categorie from "../../Redux/categorisation";
import prospect from "../../Redux/prospect";
import steps from "../../Redux/step";

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  user,
  categorie,
  alluser,
  prospect,
  steps,
});

export default reducers;
