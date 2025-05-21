// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';

// ==============================|| COMBINE REDUCERS ||============================== //

import agent from 'Redux/agent';
import feedback from 'Redux/feedback';
import mesfeedback from 'Redux/mesfeedback';
import parametre from 'Redux/parametre';
import role from 'Redux/Role';
import shop from 'Redux/shop';
import user from 'Redux/user';
import zone from 'Redux/zone';

const reducers = combineReducers({
  menu,
  user,
  agent,
  feedback,
  shop,
  parametre,
  role,
  zone,
  mesfeedback
});

export default reducers;
