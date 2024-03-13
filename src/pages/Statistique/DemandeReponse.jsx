/* eslint-disable react/prop-types */
import { lien_image } from 'static/Lien';
import React from 'react';
import './style.css';
import { Typography, Grid } from '@mui/material';
import moment from 'moment';
import { Input } from 'antd';

function DemandeReponse({ data }) {
  const handleChange = (donner) => {
    try {
      return donner.filter((x) => x.reponse.length > 0);
    } catch (error) {
      return [];
    }
  };

  const [filterFn, setFilterFn] = React.useState({
    fn: (items) => {
      return items;
    }
  });
  const handleChanges = (e) => {
    let target = e.target.value.toUpperCase();

    setFilterFn({
      fn: (items) => {
        if (target === '') {
          return items;
        } else {
          return items.filter((x) => x.reponse[0].codeclient.includes(target) || x.reponse[0].nomClient.includes(target));
        }
      }
    });
  };

  return (
    <>
      <Grid container sx={{ marginBottom: '10px' }}>
        <Grid item lg={8}>
          <Input type="text" onChange={(e) => handleChanges(e)} placeholder="Code client ou nom du client" />
        </Grid>
      </Grid>
      <Grid container>
        {data &&
          filterFn.fn(handleChange(data)).map((index) => {
            return (
              <Grid item lg={6} key={index._id} className="messagesToutes">
                <div className="listeImage">
                  <img src={`${lien_image}/${index.file}`} alt={index._id} />
                  <Typography component="p" sx={{ fontSize: '13px' }}>
                    {index.codeclient !== undefined && index.codeclient};{index?.sat} {index?.reference}
                    {index?.statut}; {index?.raison.toLowerCase()}, {index.numero && index.numero};
                  </Typography>
                </div>
                <div className="itemButtons"></div>
                <div>
                  {index.conversation.length > 0 &&
                    index.conversation.map((item) => {
                      return (
                        <div key={item._id} className={item.sender === 'agent' ? 'agent' : 'callcenter'}>
                          <p className="messageText">{item.message}</p>
                          <p className="heure">{moment(item.createdAt).fromNow()}</p>
                        </div>
                      );
                    })}
                </div>
                <div>
                  {index.reponse.length > 0 &&
                    index.reponse.map((item) => {
                      return (
                        <div key={item._id} className="reponseListe">
                          <p>{item.codeclient}</p>
                          <p style={{ fontWeight: 'bold' }}>{item.nomClient.toUpperCase()}</p>
                          <p>
                            Statut du client : <span style={{ fontWeight: 'bolder' }}>{item.clientStatut}</span>{' '}
                          </p>
                          <p>
                            Statut payement : <span style={{ fontWeight: 'bolder' }}>{item.PayementStatut}</span>
                          </p>
                          <p>
                            consExpDays :{' '}
                            <span style={{ fontWeight: 'bolder' }}>
                              {item.consExpDays}
                              {' jour(s) '}
                            </span>
                          </p>
                          <p>
                            {item.region}/{item.shop}
                          </p>
                          <p>{item?.codeCu}</p>
                        </div>
                      );
                    })}
                </div>
              </Grid>
            );
          })}
      </Grid>

      {data && data.length === 0 && (
        <p
          style={{
            fontSize: '12px',
            marginTop: '20px',
            textAlign: 'center',
            color: 'red'
          }}
        >
          Aucune demande trouvée
        </p>
      )}
    </>
  );
}

export default DemandeReponse;
