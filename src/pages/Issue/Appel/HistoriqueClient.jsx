import { Divider, Grid } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { returnName } from 'static/Lien';
import { CreateContexteTable } from './Contexte';
import './historique.css';

function HistoriqueClient() {
  const { historique, setPlainteSelect, setSelect } = React.useContext(CreateContexteTable);
  const user = useSelector((state) => state.user?.user);

  const openChat = (plainte, e) => {
    e.preventDefault();
    setPlainteSelect(plainte);
    setSelect(3);
  };

  return (
    <div>
      {historique &&
        historique?.appel.length > 0 &&
        historique.appel.map((index) => {
          return (
            <Grid
              onClick={(e) => openChat(index, e)}
              container
              className="plainte"
              key={index._id}
              sx={{ marginTop: '10px', padding: '5px' }}
            >
              <Grid item lg={6} className="infoOne">
                <p>
                  <span>Issue</span> : {index?.typePlainte}
                </p>
                <p>
                  <span>Type Issue</span> : {index?.plainteSelect}
                </p>
                <p className={index.open ? 'statut open' : 'statut'}>
                  <span>statut</span> : {index?.statut}
                </p>
              </Grid>
              <Grid item lg={6} className="infoTwo">
                <p>
                  <span>saved by</span> : {index?.submitedBy + '; '}
                  {index?.property}
                </p>
                <p>
                  <span>comment</span> : {index?.recommandation}
                </p>

                <p>{moment(index?.fullDateSave).fromNow()}</p>
              </Grid>
              <Divider />
            </Grid>
          );
        })}
      {!historique && (
        <div className="images">
          <div>
            <p>Service client Bboxx Bonjour! Je m&apos;appelle {returnName(user?.nom)} comment puis-je vous aider Monsieur?</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(HistoriqueClient);
