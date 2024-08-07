/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { lien_image } from 'static/Lien';
// import { PostDemandeFunction, ReadDemande } from "../Redux/Demande";
import { Grid, Typography } from '@mui/material';
import { CreateContexte } from 'Context';
import BasicTabs from 'Control/Tabs';
import { Image, Space, message } from 'antd';
import Chat from './Chat';
import FeedbackComponent from './FeedBack';
import ReponsesComponent from './ReponseComponent';
import './style.css';

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

  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte) => {
    navigator.clipboard.writeText(texte);
    messageApi.open({
      type: 'success',
      content: 'Done ' + texte,
      duration: 2
    });
  };

  function AfficherJsx({ demandes }) {
    return (
      <>
        <div className="demandeJsx" style={{ textAlign: 'justify' }}>
          {demandes.codeclient !== 'undefined' && (
            <Typography
              component="p"
              className="codeClient"
              onClick={() => success(demandes.codeclient)}
              style={{ color: getColor(demandes.codeclient), fontSize: '15px', fontWeight: 'bolder' }}
            >
              code client : {demandes.codeclient && demandes.codeclient.toUpperCase()}
            </Typography>
          )}

          {demandes.numero !== 'undefined' && <p>Numéro joignable du client: {demandes.numero}</p>}

          <p>Statut du client : {`${demandes.statut === 'allumer' ? 'allumé' : 'éteint'}`} </p>
          <p>Sector : {demandes?.sector} </p>
          <p>Cell : {demandes?.cell} </p>
          <p>Sat : {demandes?.sat} </p>
          <p>Reference : {demandes?.reference} </p>
          <p>Feedback : {demandes.raison.toLowerCase()}</p>
        </div>
        <Chat demandes={demandes.conversation} />
      </>
    );
  }
  return (
    <Grid container>
      <>{contextHolder}</>
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
          <p style={style.center}>Please select the request</p>
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
