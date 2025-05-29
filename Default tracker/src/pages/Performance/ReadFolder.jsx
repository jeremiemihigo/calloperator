import axios from 'axios';
import DirectionSnackbar from 'components/Direction';
import React from 'react';
import { config, lien_dt } from 'static/Lien';
import { Grid, Typography } from '../../../node_modules/@mui/material/index';
import { CreateContextePerformance } from './Context';

function ReadFolder() {
  const { data, setData, setDossierSelect } = React.useContext(CreateContextePerformance);

  const loading = async () => {
    try {
      const response = await axios.get(`${lien_dt}/read_folder`, config);
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, []);
  const [state, setState] = React.useState({ send: false, message: '', id: '' });
  const changeStatus = async (id, status) => {
    setState({ send: true, message: '', id });
    try {
      const response = await axios.put(`${lien_dt}/closeOrOpen`, { id, value: status }, config);
      if (response.status === 200) {
        setData(data.map((x) => (x._id === response.data._id ? response.data : x)));
        setState({ send: false, message: '', id: '' });
      } else {
        setState({ send: false, message: response.data, id: '' });
      }
    } catch (error) {
      setState({ send: false, message: error.message, id });
    }
  };
  return (
    <div>
      {state.message && <DirectionSnackbar message={state.message} />}
      {data &&
        data.length > 0 &&
        data.map((index) => {
          return (
            <Grid key={index._id} className="projet" onClick={() => setDossierSelect(index)}>
              <p className="titre">{index.title}</p>
              <div>
                <p>Created by : {index.savedby}</p>
                <Typography sx={{ cursor: 'pointer' }} onClick={() => changeStatus(index.id, !index.actif)} component="p">
                  {index.id === state.id ? (
                    <span className={index.actif ? 'Ouvert' : 'Fermer'}>Please wait...</span>
                  ) : (
                    <span className={index.actif ? 'Ouvert' : 'Fermer'}>Status : {index.actif ? 'Ouvert' : 'Fermer'}</span>
                  )}
                  <span>Concerne : {index.data.length} agent(s)</span>
                </Typography>
              </div>
              <div>
                <p>
                  <span>Source feedback : {index.source_feedback}</span>
                  <span>Commentaire : {index.conversation.length}</span>
                </p>
              </div>
            </Grid>
          );
        })}
    </div>
  );
}

export default ReadFolder;
