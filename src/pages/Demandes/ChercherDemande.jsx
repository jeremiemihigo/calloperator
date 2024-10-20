/* eslint-disable react/prop-types */
import { Grid } from '@mui/material';
import { Image, Input, Space } from 'antd';
import axios from 'axios';
import React from 'react';
import { lien, lien_image } from 'static/Lien';

function ChercherDemande() {
  const [id, setValue] = React.useState('');
  const [load, setLoading] = React.useState(false);
  const [data, setData] = React.useState();
  const postData = async (e) => {
    if (e.keyCode === 13 && id !== '') {
      setLoading(true);
      const resspanonse = await axios.get(lien + `/idDemande/${id}`);
      setData(resspanonse);
      console.log(load);
    }
  };
  const key = (e) => {
    e.preventDefault();
    setValue(e.target.value);
    setData();
  };
  function AfficheReponse({ item }) {
    return (
      <div className="reponseListe">
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
      <div className="demandeJsx" style={{ textAlign: 'justify' }}>
        <span>code client : {demandes.codeclient && demandes.codeclient.toUpperCase() + '; '}</span>

        <span>Secteur : {demandes.sector + '; '}</span>
        <span>Commune : {demandes.commune + '; '}</span>

        <span>Cell : {demandes.cell + '; '}</span>

        <span>Référence : {demandes.reference + '; '}</span>
        <span>Numéro joignable du client: {demandes.numero + '; '}</span>
        <span>Statut du client : {`${demandes.statut === 'allumer ' ? 'allumé' : 'éteint '}`} </span>
        <span>{demandes.raison.toLowerCase() + '; '}</span>
        <p>{demandes.agent.nom + '....... ' + demandes.agent.codeAgent}</p>

        {demandes.reponse.length > 0 ? (
          <AfficheReponse item={demandes.reponse[0]} />
        ) : (
          <p style={{ textAlign: 'center', color: 'red' }}>La demande est en attente</p>
        )}
      </div>
    );
  }
  return (
    <div>
      <Grid container>
        <Grid item lg={12}>
          <Input type="text" value={id} onChange={(e) => key(e)} onKeyUp={(e) => postData(e)} placeholder="Demande Id" />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item lg={12}>
          <p style={{ textAlign: 'center', color: 'red' }}>{data && data.status === 201 && data.data}</p>
          {data && data.status !== 201 && data.data.length > 0 && (
            <>
              <Space size={12}>
                <Image
                  width={250}
                  height={200}
                  src={`${lien_image}/${data.data[0].file}`}
                  spanlaceholder={<Image spanreview={false} src={`${lien_image}/${data.data[0].file}`} width={200} />}
                />
              </Space>
              <AfficherJsx demandes={data.data[0]} />
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default ChercherDemande;
