/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { lien_image } from 'static/Lien';
// import { PostDemandeFunction, ReadDemande } from "../Redux/Demande";
import { CreateContexte } from 'Context';
import './style.css';

import UpdateDemandeDetail from './UpdateDemandeDetail';
import Popup from 'static/Popup';
import BasicTabs from 'Control/Tabs';
import FeedbackComponent from './FeedBack';
import ReponsesComponent from './ReponseComponent';
import { Grid } from '@mui/material';
import { Image, Space } from 'antd';

function ReponseAdmin(props) {
  const { update } = props;
  const [openPopup, setOpenPopup] = React.useState(false);
  const { demande } = useContext(CreateContexte);
  const [dataTo, setDataTo] = React.useState({
    propriete: '',
    id: ''
  });

  const loading = (propriete, id, e) => {
    e.preventDefault();
    setDataTo({ propriete, id });
    setOpenPopup(true);
  };

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
        <p>
          {demandes.codeclient && (
            <span onClick={(e) => loading('codeClient', demandes._id, e)}>
              <span style={style.span}>Code Client : </span>
              {demandes.codeclient}
            </span>
          )}
        </p>

        <br />
        <p style={{ cursor: 'pointer' }}>
          <span onClick={(e) => loading('sector', demandes._id, e)}>
            <span style={style.span}>Sector : </span>
            {demandes.sector}
          </span>

          <span onClick={(e) => loading('cell', demandes._id, e)}>
            <span style={style.span}>Cell : </span>
            {demandes.cell}
          </span>

          <span onClick={(e) => loading('reference', demandes._id, e)}>
            <span style={style.span}>Référence : </span>
            {demandes.reference}
          </span>

          <span onClick={(e) => loading('sat', demandes._id, e)}>
            <span style={style.span}>Sat : </span>
            {demandes.reference}
          </span>
        </p>
        <p>
          <span onClick={(e) => loading('statut', demandes._id, e)}>
            <span style={style.span}>Statut du client</span> {`${demandes.statut === 'allumer' ? 'allumé' : 'éteint'}`}{' '}
          </span>
          {demandes.raison && (
            <span onClick={(e) => loading('raison', demandes._id, e)}>
              <span style={style.span}>Raison</span>
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

      {dataTo && (
        <Popup open={openPopup} setOpen={setOpenPopup} title="Modification">
          <UpdateDemandeDetail data={dataTo} />
        </Popup>
      )}
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
