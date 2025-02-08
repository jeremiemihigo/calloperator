// third-party
import { combineReducers } from 'redux';

// project import
import agent from 'Redux/Agent';
import agentAdmin from 'Redux/AgentAdmin';
import communication from 'Redux/Communication';
import parametre from 'Redux/Parametre';
import periodeActive from 'Redux/PeriodeActive';
import plainte from 'Redux/Plainte';
import itemPlainte from 'Redux/PlainteItem';
import reponse from 'Redux/Reponses';
import shop from 'Redux/Shop';
import zone from 'Redux/Zone';
import delai from 'Redux/delai';
import role from 'Redux/role';
import user from 'Redux/user';
import menu from './menu';
// import contrat from 'Redux/Contrat';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  menu,
  zone,
  communication,
  delai,
  plainte,
  agentAdmin,
  user,
  agent,
  reponse,
  periodeActive,
  shop,
  itemPlainte,
  parametre,
  role
});

export default reducers;
