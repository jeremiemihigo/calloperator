/* eslint-disable react/prop-types */
import { Grid } from '@mui/material';
import { Input, Space } from 'antd';
import axios from 'axios';
import ImageComponent from 'Control/ImageComponent';
import Chat from 'pages/Demandes/Chat';
import React from 'react';
import { config, lien, lien_image } from 'static/Lien';

function ChercherDemande() {
  const [id, setValue] = React.useState('');
  const [load, setLoading] = React.useState(false);
  const [data, setData] = React.useState();
  const postData = async (e) => {
    if (e.keyCode === 13 && id !== '') {
      try {
        setLoading(true);
        const resspanonse = await axios.get(lien + `/idDemande/${id}`, config);
        if (resspanonse.data === 'token expired') {
          localStorage.removeItem('auth');
          window.location.replace('/login');
        } else {
          setData(resspanonse.data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const key = (e) => {
    e.preventDefault();
    setValue(e.target.value);
    setData();
  };
  function AfficheReponse({ item }) {
    return (
      <div className="reponseListe" style={{ paddingLeft: '30px' }}>
        <p>{item.codeclient}</p>
        <p>{item.nomClient}</p>
        <p>Statut du client ;{item.clientStatut}</p>
        <p>Statut payement ;{item.PayementStatut}</p>

        <p>
          consExpDays : {item.consExpDays} {`${item.consExpDays === 1 ? 'Jour' : 'Jours'}`}
        </p>

        <p>{/* {item.region}/{item.shop} */}</p>
        <p>{item?.codeCu}</p>
      </div>
    );
  }
  function AfficherJsx({ demandes }) {
    return (
      <>
        <div className="demandeJsx" style={{ textAlign: 'justify', marginLeft: '10px' }}>
          <p>code client : {demandes.codeclient && demandes.codeclient.toUpperCase() + '; '}</p>

          <p>Secteur : {demandes.sector + '; '}</p>
          <p>Commune : {demandes.commune + '; '}</p>

          <p>Cell : {demandes.cell + '; '}</p>

          <p>Référence : {demandes.reference + '; '}</p>
          <p>Numéro joignable du client: {demandes.numero + '; '}</p>
          <p>Statut du client : {`${demandes.statut === 'allumer ' ? 'allumé' : 'éteint '}`} </p>
          <p>{demandes.raison.toLowerCase() + '; '}</p>
          <p>{demandes.agent.nom + '....... ' + demandes.agent.codeAgent}</p>
          <Chat demandes={demandes.messages} />
        </div>
      </>
    );
  }
  return (
    <div>
      {data && data.length < 1 ? (
        <p style={{ textAlign: 'center', color: 'red' }}>Code introuvable</p>
      ) : (
        <>
          <Grid container sx={{ marginBottom: '12px' }}>
            <Grid item lg={12}>
              <Input
                type="text"
                disabled={load}
                value={id}
                onChange={(e) => key(e)}
                onKeyUp={(e) => postData(e)}
                placeholder="Demande Id"
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item lg={8} sm={12} sx={12}>
              <p style={{ fontSize: '14px', fontWeight: 'bolder' }}>Demande</p>
              {data && data.length > 0 && (
                <Grid sx={{ display: 'flex' }}>
                  <Space size={12}>
                    <ImageComponent src={`${lien_image}/${data.file}`} taille={200} />
                  </Space>
                  <AfficherJsx demandes={data[0]} />
                </Grid>
              )}
            </Grid>
            <Grid item lg={4}>
              <p style={{ fontSize: '14px', fontWeight: 'bolder', paddingLeft: '30px' }}>Réponse</p>
              {data && data[0].reponse.length > 0 ? (
                <AfficheReponse item={data[0].reponse[0]} />
              ) : (
                <p style={{ textAlign: 'center', color: 'red' }}>La demande est en attente</p>
              )}
            </Grid>
          </Grid>
          <div className="marge" style={{ marginTop: '5px' }}></div>
        </>
      )}
    </div>
  );
}

export default ChercherDemande;
