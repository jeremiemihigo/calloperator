/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import { Card, Grid, Typography } from '@mui/material';
import { Image, Space, message } from 'antd';
import BasicTabs from 'Control/Tabs';
import { CreateContexteGlobal } from 'GlobalContext';
import moment from 'moment';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { lien_image } from 'static/Lien';
import Chat from './Chat';
import { CreateContexteDemande } from './ContextDemande';
import FeedbackComponent from './FeedBack';
import ReponsesComponent from './ReponseComponent';
import './style.css';
import UpdateForm from './Updateform';

function ReponseAdmin(props) {
  const { update } = props;
  const { demande, reponseNow } = useContext(CreateContexteGlobal);
  const { changeRecent, lastImages, recentAnswerSelect } = useContext(CreateContexteDemande);

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
          {demandes.feedbackrs && (
            <p
              style={{
                padding: '0px',
                margin: '0px',
                fontSize: '14px',
                color: 'red',
                fontWeight: 'bolder'
              }}
            >
              RS : <span>{demandes.feedbackrs}</span>
            </p>
          )}
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
  const regions = useSelector((state) => state.zone.zone);
  const returnZone = (id) => {
    return _.filter(regions, { idZone: id })[0]?.denomination;
  };
  const returnName = (name) => {
    return name.split(' ')[name.split(' ').length - 1];
  };
  return (
    <Grid container>
      <>{contextHolder}</>
      <Grid item lg={5} sx={{ width: '100%' }}>
        {(demande || update) && (
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
            <p style={{ textAlign: 'center', fontWeight: 'bolder' }}>{lastImages && lastImages.length + ' Recente(s) image(s)'} </p>
            <Grid container sx={{ marginTop: '10px' }}>
              {lastImages &&
                lastImages.length > 0 &&
                lastImages.map((index) => {
                  return (
                    <Grid sx={{ paddingRight: '5px' }} item lg={3} key={index._id}>
                      <Space>
                        <Image
                          height={50}
                          width={50}
                          src={`${lien_image}/${index?.demande?.file}`}
                          placeholder={<Image preview={false} src={`${lien_image}/${index?.demande?.file}`} width={200} />}
                        />
                      </Space>{' '}
                    </Grid>
                  );
                })}
            </Grid>
          </>
        )}
        {!demande && reponseNow && reponseNow.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <p>Recent answers</p>
            {reponseNow.map((index) => {
              return (
                <Card
                  onClick={() => changeRecent(index)}
                  className={recentAnswerSelect && index._id === recentAnswerSelect?._id ? 'colorGreen' : 'colornogreen'}
                  key={index._id}
                >
                  <div style={{ width: '100%' }}>
                    <Typography component="p" noWrap style={{ padding: '0px', fontSize: '12px', margin: '0px' }}>
                      {returnName(index.agentSave?.nom)};{returnZone(index.idZone)}
                    </Typography>
                    <Typography
                      component="p"
                      noWrap
                      style={{
                        padding: '0px',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        margin: '0px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <span>
                        {index?.consExpDays + 'jr(s)'};{' ' + index?.PayementStatut}
                      </span>
                      <span style={{ float: 'right', fontSize: '9px' }}>{moment(index.createdAt).fromNow()}</span>
                    </Typography>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Grid>
      <Grid item lg={7}>
        {recentAnswerSelect ? (
          <UpdateForm update={recentAnswerSelect} show={true} />
        ) : (
          <BasicTabs titres={titres} components={components} />
        )}
      </Grid>
    </Grid>
  );
}

export default React.memo(ReponseAdmin);
