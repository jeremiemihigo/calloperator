// third-party
import { configureStore } from '@reduxjs/toolkit';

// project import
import reducers from './reducers';
import { ReadReponse } from 'Redux/Reponses';
import { ReadAgent } from 'Redux/Agent';
import { ReadAllZone } from 'Redux/Zone';
import { ReadPeriode } from 'Redux/PeriodeDossier';
import { ReadPeriodeActive } from 'Redux/PeriodeActive';
import { ReadStat } from 'Redux/StatShop';
import { ReadRaison } from 'Redux/Raison';
import { ReadUser } from 'Redux/user';
import { ReadAgentAdmin } from 'Redux/AgentAdmin';
import { ReadShop } from 'Redux/Shop';
import { ReadContrat } from 'Redux/Contrat';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const store = configureStore({
  reducer: reducers
});

const { dispatch } = store;
dispatch(ReadUser());
dispatch(ReadReponse());
dispatch(ReadAgent());
dispatch(ReadAllZone());
dispatch(ReadPeriode());
dispatch(ReadPeriodeActive());
dispatch(ReadStat());
dispatch(ReadRaison());
dispatch(ReadAgentAdmin());
dispatch(ReadShop());
dispatch(ReadContrat());

export { store, dispatch };
