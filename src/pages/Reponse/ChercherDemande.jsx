/* eslint-disable react/prop-types */
import React from 'react';
import { Grid } from '@mui/material';
import axios from 'axios';
import { Input } from 'antd';
import { config, lien, lien_image } from 'static/Lien';
import { Image, Space } from 'antd';
import Chat from 'pages/Demandes/Chat';

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
          setData(resspanonse);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  console.log(data);
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

        <p>
          {item.region}/{item.shop}
        </p>
        <p>{item?.codeCu}</p>
      </div>
    );
  }
  function AfficherJsx({ demandes }) {
    return (
      <>
        <div className="demandeJsx" style={{ textAlign: 'justify', marginLeft: '10px' }}>
          <span>code client : {demandes.codeclient && demandes.codeclient.toUpperCase() + '; '}</span>

          <span>Secteur : {demandes.sector + '; '}</span>
          <span>Commune : {demandes.commune + '; '}</span>

          <span>Cell : {demandes.cell + '; '}</span>

          <span>Référence : {demandes.reference + '; '}</span>
          <span>Numéro joignable du client: {demandes.numero + '; '}</span>
          <span>Statut du client : {`${demandes.statut === 'allumer ' ? 'allumé' : 'éteint '}`} </span>
          <span>{demandes.raison.toLowerCase() + '; '}</span>
          <p>{demandes.agent.nom + '....... ' + demandes.agent.codeAgent}</p>
          <Chat demandes={demandes.messages} />
        </div>
      </>
    );
  }
  return (
    <div>
      {data && data.status === 201 ? (
        <p style={{ textAlign: 'center', color: 'red' }}>{data && data.status === 201 && data.data}</p>
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
              {data && data.status !== 201 && data.data.demande.length > 0 && (
                <Grid sx={{ display: 'flex' }}>
                  <Space size={12}>
                    <Image
                      width={250}
                      height={200}
                      src={`${lien_image}/${data.data.demande[0].file}`}
                      placeholder={<Image preview={false} src={`${lien_image}/${data.data.demande[0].file}`} width={200} />}
                    />
                  </Space>
                  <AfficherJsx demandes={data.data.demande[0]} />
                </Grid>
              )}
            </Grid>
            <Grid item lg={4}>
              <p style={{ fontSize: '14px', fontWeight: 'bolder', paddingLeft: '30px' }}>Réponse</p>
              {data && data.data?.demande[0]?.reponse.length > 0 ? (
                <AfficheReponse item={data.data.demande[0].reponse[0]} />
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
