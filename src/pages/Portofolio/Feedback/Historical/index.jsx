import { Paper } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import React from 'react';
import { config, portofolio } from 'static/Lien';
import { ContextFeedback } from '../Context';
import Today from './Today';

function Index() {
  const { client } = React.useContext(ContextFeedback);
  const [data, setData] = React.useState();
  const loading = async () => {
    try {
      setData();
      const response = await axios.get(`${portofolio}/information/${client?.codeclient}`, config);
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, [client]);
  return (
    <div>
      <Paper className="historical">
        <p>Last technical Issue</p>
      </Paper>
      {data && data.plainte.length > 0 ? (
        <Paper className="item_historical">
          <p>Issue : {data && data.plainte[0].typePlainte}</p>
          <p>Type : {data && data.plainte[0].plainteSelect}</p>
          <div className="bottom_item">
            <p>Statut : {data && data.plainte[0].statut}</p>
            <p>{data && moment(data.plainte[0].dateSave).fromNow()}</p>
          </div>
        </Paper>
      ) : (
        <Paper className="item_historical">
          <p>Issue : Loading...</p>
          <p>Type : Loading...</p>
          <div className="bottom_item">
            <p>Statut : Loading...</p>
            <p>Loading...</p>
          </div>
        </Paper>
      )}

      <Paper className="historical" style={{ marginTop: '10px' }}>
        <p>Last household visit</p>
      </Paper>
      {data && data.visite.length > 0 ? (
        <Paper className="item_historical">
          <p>{data && data.visite[0].demande.raison}</p>
          <div className="bottom_item">
            <p style={{ textAlign: 'right' }}>{data && moment(data.visite[0].demande.updatedAt).fromNow()}</p>
          </div>
        </Paper>
      ) : (
        <Paper className="item_historical">
          <p>Raison : Loading...</p>
          <div className="bottom_item">
            <p style={{ textAlign: 'right' }}>Loading...</p>
          </div>
        </Paper>
      )}
      <Paper className="historical" style={{ marginTop: '10px' }}>
        <p>My Record call of today</p>
      </Paper>
      <div className="statistique">
        <Today />
      </div>
    </div>
  );
}

export default Index;
