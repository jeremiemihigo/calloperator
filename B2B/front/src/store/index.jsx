// third-party
import { configureStore } from "@reduxjs/toolkit";

// project import
// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //
// import { Readaction } from "../Redux/actions";
// import { ReadCommuniquer } from "../Redux/Documentation";
import { Readusers } from "../Redux/AllUser";
import { Readprojets } from "../Redux/projet";
import { Readprospects } from "../Redux/prospect";
import { Readsteps } from "../Redux/step";
import { ReadUser } from "../Redux/Utilisateur";
import reducers from "./reducers";
const store = configureStore({
  reducer: reducers,
});

const { dispatch } = store;

dispatch(ReadUser());
dispatch(Readusers());
dispatch(Readsteps());
dispatch(Readprojets());
dispatch(Readprospects());

export { dispatch, store };
