// third-party
import { configureStore } from '@reduxjs/toolkit';

// project import
import { ReadAgent } from 'Redux/Agent';
import { ReadAgentAdmin } from 'Redux/AgentAdmin';
import { Readcommunication } from 'Redux/Communication';
import { ReadPeriodeActive } from 'Redux/PeriodeActive';
import { ReadPlainte } from 'Redux/Plainte';
import { ReadplainteItem } from 'Redux/PlainteItem';
import { ReadRaison } from 'Redux/Raison';
import { ReadReponse } from 'Redux/Reponses';
import { ReadShop } from 'Redux/Shop';
import { ReadAllZone } from 'Redux/Zone';
import { Readdelai } from 'Redux/delai';
import { ReadProjet } from 'Redux/projet';
import { ReadUser } from 'Redux/user';
import reducers from './reducers';
// import { ReadContrat } from 'Redux/Contrat';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const store = configureStore({
  reducer: reducers
});

const { dispatch } = store;
dispatch(ReadUser());
dispatch(ReadReponse());
dispatch(ReadAgent());
dispatch(ReadAllZone());
dispatch(ReadPeriodeActive());
dispatch(ReadRaison());
dispatch(ReadAgentAdmin());
dispatch(ReadShop());
dispatch(ReadPlainte());
dispatch(Readdelai());
dispatch(ReadplainteItem());
dispatch(Readcommunication());
dispatch(ReadProjet());

export { dispatch, store };
