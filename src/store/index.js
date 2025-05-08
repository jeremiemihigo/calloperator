// third-party
import { configureStore } from "@reduxjs/toolkit";

// project import
import { ReadAgent } from "Redux/Agent";
import { ReadAgentAdmin } from "Redux/AgentAdmin";
import { Readcommunication } from "Redux/Communication";
import { ReadParametre } from "Redux/Parametre";
import { ReadPlainte } from "Redux/Plainte";
import { ReadplainteItem } from "Redux/PlainteItem";
import { ReadReponse } from "Redux/Reponses";
import { ReadShop } from "Redux/Shop";
import { ReadAllZone } from "Redux/Zone";
import { Readdelai } from "Redux/delai";
import { Readrole } from "Redux/role";
import { ReadUser } from "Redux/user";
import reducers from "./reducers";
// import { ReadContrat } from 'Redux/Contrat';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const store = configureStore({
  reducer: reducers,
});

const { dispatch } = store;
dispatch(ReadUser());
dispatch(ReadReponse());
dispatch(ReadAgent());
dispatch(ReadAllZone());
dispatch(ReadAgentAdmin());
dispatch(ReadShop());
dispatch(ReadPlainte());
dispatch(Readdelai());
dispatch(ReadplainteItem());
dispatch(Readcommunication());
dispatch(ReadParametre());
dispatch(Readrole());

export { dispatch, store };
