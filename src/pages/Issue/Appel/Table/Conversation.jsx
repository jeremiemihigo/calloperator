import { Button, Grid, Paper, Typography } from '@mui/material';
import { TextField } from '@mui/material/';
import { message } from 'antd';
import axios from 'axios';
import { CreateContexteGlobal } from 'GlobalContext';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_issue, returnName } from 'static/Lien';
import InfoCustomer from '../Component/InfoCustomer';
import { CreateContexteTable } from '../Contexte';

function Conversation() {
  const { plainteSelect, setSelect } = React.useContext(CreateContexteTable);
  const user = useSelector((state) => state.user?.user);
  const [data, setData] = React.useState([]);
  const [content, setContent] = React.useState('');
  const { client, setClient } = React.useContext(CreateContexteGlobal);
  const [sending, setSending] = React.useState(false);
  const sendMessage = async (e) => {
    try {
      e.preventDefault();
      setSending(true);
      const response = await axios.post(
        lien_issue + '/message',
        {
          idPlainte: plainteSelect?.idPlainte,
          content,
          type: 'message'
        },
        config
      );
      if (response.status === 200) {
        setData([...data, response.data]);
        setContent('');
        setSending(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    if (plainteSelect?.message && plainteSelect?.message.length > 0) {
      setData(plainteSelect?.message);
    }
  }, [plainteSelect]);

  const returnTime = (date1, date2) => {
    let resultat = (new Date(date2).getTime() - new Date(date1).getTime()) / 60000;
    if (resultat < 1) {
      return 1;
    } else {
      return resultat;
    }
  };
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: '' + texte,
      duration: 10
    });
  };
  const changeStatus = async () => {
    try {
      setSending(true);
      const response = await axios.post(
        `${lien_issue}/updateappel`,
        {
          id: plainteSelect._id,
          data: {
            open: false,
            closeBy: user?.nom,
            delai: plainteSelect.time_delai - returnTime(plainteSelect.fullDateSave, new Date()) > 0 ? 'IN SLA' : 'OUT SLA'
          }
        },
        config
      );
      if (response.status === 200) {
        success('Done', 'success');
        setClient(client.map((x) => (x._id === response.data._id ? response.data : x)));
        setSending(false);
        setSelect(2);
      }
      if (response.status === 201) {
        success('' + response.data, 'error');
        setSending(false);
      }
    } catch (error) {
      success('' + error, 'error');
    }
  };
  return (
    <>
      {contextHolder}
      <Grid container sx={{ marginTop: '10px' }}>
        <Grid item lg={6} xs={12} sm={4} md={4}>
          <InfoCustomer plainteSelect={plainteSelect} />

          <Paper sx={{ padding: '10px', marginTop: '4px' }}>
            <div className="adresseInfo">
              <p className="adresseP">Customer Informations</p>
              {plainteSelect?.adresse?.contact && (
                <p>
                  <span>Contact</span>
                  {' : ' + plainteSelect?.adresse?.contact}
                </p>
              )}
              {plainteSelect?.decodeur && (
                <p>
                  <span>Décodeur</span>
                  {' : ' + plainteSelect?.decodeur}
                </p>
              )}
              {plainteSelect?.adresse?.commune && (
                <p>
                  <span>Commune </span>
                  {' : ' + plainteSelect?.adresse?.commune}
                </p>
              )}
              {plainteSelect?.adresse?.quartier && (
                <p>
                  <span>Quartier </span>
                  {' : ' + plainteSelect?.adresse?.quartier}
                </p>
              )}
              {plainteSelect?.adresse?.avenue && (
                <p>
                  <span>Avenue </span>
                  {' : ' + plainteSelect?.adresse?.avenue}
                </p>
              )}
              {plainteSelect?.adresse?.reference && (
                <p>
                  <span>Reference </span>
                  {' : ' + plainteSelect?.adresse?.reference}
                </p>
              )}
            </div>
          </Paper>
          <Paper sx={{ padding: '10px', marginTop: '4px' }}>
            {plainteSelect &&
              plainteSelect?.resultat.length > 0 &&
              plainteSelect?.resultat.map((index) => {
                return (
                  <div key={index._id} className="resultat">
                    <div>
                      <p>
                        <span>last_status : </span>
                        {index?.laststatus}
                      </p>
                      <p>
                        <span>change_to : </span>
                        {index?.changeto}
                      </p>
                      <p>
                        <span>Do_by : </span>
                        {index?.nomAgent}
                      </p>
                      <p>
                        <span>SLA : </span>
                        {index?.delai}
                      </p>
                      <p>
                        <span>Comment : </span>
                        {index?.commentaire}
                      </p>
                      <p>
                        <span>Date : </span>
                        {moment(index?.fullDate).format('DD/MM/YYYY hh:mm')}
                      </p>
                    </div>
                  </div>
                );
              })}
          </Paper>
        </Grid>
        <Grid item lg={6} xs={12} sm={8} md={8}>
          <Paper className="papierConv" elevation={3}>
            ID : {plainteSelect?.idPlainte}
          </Paper>
          <div>
            {data &&
              data.map((index) => {
                return (
                  <Paper elevation={3} key={index._id} className="papierConv">
                    <Grid container>
                      <Grid item lg={2} className="userP">
                        <div>
                          <Typography noWrap component="p">
                            {index.agent === user.nom ? 'Moi' : returnName(index.agent)}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item lg={10} className="body_content">
                        <p>{index.content}</p>
                      </Grid>
                    </Grid>
                  </Paper>
                );
              })}
          </div>
          {plainteSelect?.open ? (
            <div className="forme">
              <Grid container>
                <Grid item lg={8} xs={8} sm={8} md={8}>
                  <TextField value={content} onChange={(e) => setContent(e.target.value)} autoComplete="off" fullWidth label="Message" />
                </Grid>
                <Grid item lg={2} xs={2} sm={2} md={2} sx={{ paddingLeft: '1px' }}>
                  <Button fullWidth disabled={sending} color="primary" variant="contained" onClick={(e) => sendMessage(e)}>
                    Save
                  </Button>
                </Grid>
                {user?.backOffice_plainte && (
                  <Grid item lg={2} xs={2} sm={2} md={2} sx={{ paddingLeft: '5px' }}>
                    <Button fullWidth disabled={sending} color="primary" variant="contained" onClick={(e) => changeStatus(e)}>
                      Close
                    </Button>
                  </Grid>
                )}
              </Grid>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'red', fontWeight: 'bolder' }}>The_complaint_is_already_closed</p>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default React.memo(Conversation);
