/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { lien_image } from 'static/Lien';
// import { PostDemandeFunction, ReadDemande } from "../Redux/Demande";
import { CreateContexte } from 'Context';
import './style.css';
import moment from 'moment';
import BasicTabs from 'Control/Tabs';
import FeedbackComponent from './FeedBack';
import ReponsesComponent from './ReponseComponent';
import { Grid, Typography } from '@mui/material';
import { Image, Space, message } from 'antd';

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
          <p>ID demande : {demandes.idDemande}</p>
          <Typography
            component="p"
            className="codeClient"
            onClick={() => success(demandes.codeclient)}
            style={{ color: getColor(demandes.codeclient) }}
          >
            code client : {demandes.codeclient && demandes.codeclient.toUpperCase()}
          </Typography>
          <p style={{ color: getColor(demandes.numero) }}>Numéro joignable du client: {demandes.numero}</p>
          <p>Statut du client : {`${demandes.statut === 'allumer' ? 'allumé' : 'éteint'}`} </p>
          <p>Feedback : {demandes.raison.toLowerCase()}</p>
        </div>

        {demandes.conversation.length > 0 && (
          <div>
            {demandes.conversation.map((index) => {
              return (
                <div key={index._id} className={index.sender === 'co' ? 'co' : 'agent'}>
                  <p className={index.sender === 'co' ? 'message' : 'messageAgent'}>{index.message}</p>
                  <p className="heures">
                    {index.codeAgent + ' ----------- '}
                    {moment(index.createdAt).fromNow()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
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
