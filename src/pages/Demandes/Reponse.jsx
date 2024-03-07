/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { lien_image } from 'static/Lien';
// import { PostDemandeFunction, ReadDemande } from "../Redux/Demande";
import { CreateContexte } from 'Context';
import './style.css';

import BasicTabs from 'Control/Tabs';
import FeedbackComponent from './FeedBack';
import ReponsesComponent from './ReponseComponent';
import { Grid } from '@mui/material';
import { Image, Space } from 'antd';

function ReponseAdmin(props) {
  const { update } = props;
  const { demande } = useContext(CreateContexte);

  const titres = [
    { id: 0, label: 'Reponse' },
    { id: 1, label: 'Feedback' }
  ];
  const components = [
    { id: 0, component: <ReponsesComponent update={update} /> },
    {
      id: 1,
      component: <FeedbackComponent demande={demande} update={update} />
    }
  ];

  const getColor = (item) => {
    return !item && 'red';
  };

  function AfficherJsx({ demandes }) {
    return (
      <div className="demandeJsx" style={{ textAlign: 'justify' }}>
        <p>ID demande : {demandes.idDemande}</p>
        <p style={{ color: getColor(demandes.codeclient) }}>code client : {demandes.codeclient && demandes.codeclient.toUpperCase()}</p>
        <p style={{ color: getColor(demandes.numero) }}>Numéro joignable du client: {demandes.numero}</p>
        <p>Statut du client : {`${demandes.statut === 'allumer' ? 'allumé' : 'éteint'}`} </p>
        <p>Feedback : {demandes.raison.toLowerCase()}</p>
      </div>
    );
  }
  return (
    <Grid container>
      <Grid item lg={6}>
        {demande || update ? (
          <>
            <Space size={12}>
              <Image
                width={200}
                src={`${lien_image}/${update ? update.demande.file : demande.file}`}
                placeholder={<Image preview={false} src={`${lien_image}/${update ? update.demande.file : demande.file}`} width={200} />}
              />
            </Space>
            {demande && !update && <AfficherJsx demandes={demande} />}
            {update && <AfficherJsx demandes={update.demande} />}
          </>
        ) : (
          <p style={style.center}>Veuillez selectionner la demande</p>
        )}
      </Grid>
      <Grid item lg={6}>
        <BasicTabs titres={titres} components={components} />
      </Grid>
    </Grid>
  );
}
const style = {
  span: {
    color: '#0078',
    fontWeight: 'bold',
    marginRight: '5px',
    marginLeft: '5px'
  },
  center: {
    textAlign: 'center',
    color: 'red'
  }
};
export default React.memo(ReponseAdmin);
