// third-party
import { combineReducers } from 'redux';

// project import
import agent from 'Redux/Agent';
import agentAdmin from 'Redux/AgentAdmin';
import periodeActive from 'Redux/PeriodeActive';
import plainte from 'Redux/Plainte';
import raison from 'Redux/Raison';
import reponse from 'Redux/Reponses';
import shop from 'Redux/Shop';
import zone from 'Redux/Zone';
import user from 'Redux/user';
import menu from './menu';
// import contrat from 'Redux/Contrat';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  menu,
  zone,
  plainte,
  agentAdmin,
  user,
  raison,
  agent,
  reponse,
  periodeActive,
  shop
});

export default reducers;
