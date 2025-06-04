// third-party
import { configureStore } from "@reduxjs/toolkit";

// project import
// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //
// import { Readaction } from "../Redux/actions";
// import { ReadCommuniquer } from "../Redux/Documentation";
import { Readaction } from "../Redux/action";
import { Readusers } from "../Redux/AllUser";
import { Readcategories } from "../Redux/categorisation";
import { Readprospects } from "../Redux/prospect";
import { ReadUser } from "../Redux/Utilisateur";
import reducers from "./reducers";
const store = configureStore({
  reducer: reducers,
});

const { dispatch } = store;

dispatch(ReadUser());
dispatch(Readusers());
dispatch(Readprospects());
dispatch(Readcategories());
dispatch(Readaction());

export { dispatch, store };
