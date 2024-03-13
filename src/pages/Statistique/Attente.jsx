/* eslint-disable react/prop-types */
import { lien_image } from 'static/Lien';
import React from 'react';
import './style.css';
import { Typography, Grid } from '@mui/material';
import moment from 'moment';
import { Input } from 'antd';

import { message } from 'antd';

function Attente({ data }) {
  const handleChange = (donner) => {
    try {
      return donner.filter((x) => x.reponse.length === 0);
    } catch (error) {
      return [];
    }
  };
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte) => {
    navigator.clipboard.writeText(texte);
    messageApi.open({
      type: 'success',
      content: 'Done ' + texte,
      duration: 2
    });
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
          return items.filter((x) => x.codeclient.includes(target));
        }
      }
    });
  };

  return (
    <>
      <>{contextHolder}</>
      <Grid container sx={{ marginBottom: '10px' }}>
        <Grid item lg={8}>
          <Input type="text" onChange={(e) => handleChanges(e)} placeholder="Code client ou ID demande" />
        </Grid>
      </Grid>
      <Grid container>
        {data &&
          filterFn.fn(handleChange(data)).map((index) => {
            return (
              <Grid item lg={12} key={index._id} className="messagesToutes">
                <div className="listeImage">
                  <img src={`${lien_image}/${index.file}`} alt={index._id} />
                  <Typography component="p" sx={{ fontSize: '13px' }}>
                    <Typography>
                      ID : {index.idDemande}
                      <Typography
                        component="span"
                        onClick={() => success(index.idDemande)}
                        style={{ marginLeft: '10px', color: 'blue', fontWeight: 'bolder', cursor: 'pointer', textAlign: 'center' }}
                      >
                        copy ID
                      </Typography>
                      <span style={{ float: 'right', fontSize: '10px' }}>{moment(index.createdAt).fromNow()}</span>
                    </Typography>
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

export default Attente;
