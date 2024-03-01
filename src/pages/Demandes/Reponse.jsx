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

  function AfficherJsx({ demandes }) {
    return (
      <div style={{ textAlign: 'justify' }}>
        <p>{demandes.codeclient && <span>{demandes.codeclient};</span>}</p>

        <p>
          <span>{demandes.sector};</span>
          <span>{demandes.commune + '; '}</span>

          <span>{demandes.cell + '; '}</span>

          <span>{demandes.reference + '; '}</span>
          <span>contact : {demandes.numero + '; '}</span>
        </p>
        <p>
          <span> {`${demandes.statut === 'allumer' ? 'client allumé;' : 'client éteint;'}`} </span>
          {demandes.raison && (
            <span>
              <span style={style.span}></span>
              {demandes.raison}
            </span>
          )}
        </p>
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
