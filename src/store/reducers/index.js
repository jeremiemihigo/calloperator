// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import zone from 'Redux/Zone';
import agent from 'Redux/Agent';
import reponse from 'Redux/Reponses';
import periodeStore from 'Redux/PeriodeDossier';
import periodeActive from 'Redux/PeriodeActive';
import statShop from 'Redux/StatShop';
import raison from 'Redux/Raison';
import user from 'Redux/user';
import agentAdmin from 'Redux/AgentAdmin';
import shop from 'Redux/Shop';
import formation from 'Redux/Formation';
// import contrat from 'Redux/Contrat';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  menu,
  zone,
  agentAdmin,
  user,
  raison,
  statShop,
  agent,
  reponse,
  periodeStore,
  periodeActive,
  shop,
  formation
});

export default reducers;
