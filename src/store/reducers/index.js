// third-party
import { combineReducers } from 'redux';

// project import
import agent from 'Redux/Agent';
import agentAdmin from 'Redux/AgentAdmin';
import communication from 'Redux/Communication';
import parametre from 'Redux/Parametre';
import plainte from 'Redux/Plainte';
import itemPlainte from 'Redux/PlainteItem';
import reponse from 'Redux/Reponses';
import shop from 'Redux/Shop';
import zone from 'Redux/Zone';
import delai from 'Redux/delai';
import formulaire from 'Redux/formulaire';
import projet from 'Redux/projet';
import role from 'Redux/role';
import user from 'Redux/user';
import menu from './menu';

// import contrat from 'Redux/Contrat';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  menu,
  zone,
  formulaire,
  projet,
  communication,
  delai,
  plainte,
  agentAdmin,
  user,
  agent,
  reponse,
  shop,
  itemPlainte,
  parametre,
  role
});

export default reducers;
