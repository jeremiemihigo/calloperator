// third-party
import { configureStore } from '@reduxjs/toolkit';

// project import
import { Readagent } from 'Redux/agent';
import { Readfeedback } from 'Redux/feedback';
import { ReadfeedbackPortoVm } from 'Redux/feedbackvmportof';
import { ReadMesfeedback } from 'Redux/mesfeedback';
import { Readparametre } from 'Redux/parametre';
import { Readrole } from 'Redux/Role';
import { ReadShop } from 'Redux/shop';
import { ReadUser } from 'Redux/user';
import { ReadAllZone } from 'Redux/zone';
import reducers from './reducers';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const store = configureStore({
  reducer: reducers
});

const { dispatch } = store;
dispatch(ReadUser());
dispatch(Readagent());
dispatch(Readfeedback());
dispatch(Readparametre());
dispatch(Readrole());
dispatch(ReadAllZone());
dispatch(ReadMesfeedback());
dispatch(ReadShop());
dispatch(ReadfeedbackPortoVm());

export { dispatch, store };
