// third-party
import { configureStore } from '@reduxjs/toolkit';

// project import
import reducers from './reducers';
import { ReadReponse } from 'Redux/Reponses';
import { ReadParametre } from 'Redux/Parametre';
import { ReadAgent } from 'Redux/Agent';
import { ReadAllZone } from 'Redux/Zone';
import { ReadPeriode } from 'Redux/PeriodeDossier';
import { ReadPeriodeActive } from 'Redux/PeriodeActive';
import { ReadStat } from 'Redux/StatShop';
import { ReadRaison } from 'Redux/Raison';
import { ReadUser } from 'Redux/user';
import { ReadAgentAdmin } from 'Redux/AgentAdmin';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const store = configureStore({
  reducer: reducers
});

const { dispatch } = store;
dispatch(ReadUser());
dispatch(ReadReponse());
dispatch(ReadParametre());
dispatch(ReadAgent());
dispatch(ReadAllZone());
dispatch(ReadPeriode());
dispatch(ReadPeriodeActive());
dispatch(ReadStat());
dispatch(ReadRaison());
dispatch(ReadAgentAdmin());

export { store, dispatch };
