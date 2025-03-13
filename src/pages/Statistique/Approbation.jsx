import { Card, Grid, Typography } from '@mui/material';
import { Image, Input, Space } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import Chat from 'pages/Demandes/Chat';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien, lien_image } from 'static/Lien';
import { Button } from '../../../node_modules/@mui/material/index';
import './approb.style.css';
const { TextArea } = Input;

function Approbation() {
  const [data, setData] = React.useState();
  const agent = useSelector((state) => state.agent.agent);
  const [feedback, setFeedback] = React.useState('');

  const returnAgent = (id, key) => {
    if (agent && agent.length > 0) {
      if (key === 'shop') {
        return _.filter(agent, { codeAgent: id })[0]?.shop[0]?.shop;
      } else {
        return _.filter(agent, { codeAgent: id })[0]?.nom;
      }
    } else {
      return '';
    }
  };

  const loading = async () => {
    try {
      const response = await axios.get(lien + '/approbation', config);
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, []);
  const [onselect, setSelect] = React.useState();

  const Approved = async (statut) => {
    try {
      const response = await axios.post(
        lien + '/approvedbyRs',
        {
          id: onselect._id,
          feedbackrs: feedback,
          concerne: statut === 'approved' ? 'rs' : 'agent',
          feedback: statut === 'approved' ? 'new' : 'chat'
        },
        config
      );
      if (response.status === 200) {
        setData(data.filter((x) => x._id !== onselect._id));
        setSelect();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Grid container>
        <Grid item lg={3}>
          {data &&
            data.map((items) => {
              return (
                <Card
                  onClick={() => setSelect(items)}
                  style={{
                    cursor: 'pointer',
                    padding: '5px',
                    marginBottom: '4px'
                  }}
                  key={items._id}
                  className={onselect && onselect._id === items._id ? 'colorGreen' : ''}
                >
                  <div className="allP">
                    <p>
                      {' '}
                      {returnAgent(items.codeAgent, 'shop')}; {items.codeclient && items.codeclient !== 'undefined' && items.codeclient}{' '}
                      {items.statut} {items.codeAgent}
                    </p>
                    <p style={{ fontSize: '9px' }}>
                      {returnAgent(items.codeAgent, 'nom')}
                      <span style={{ float: 'right' }}>{moment(items.createdAt).fromNow()}</span>
                    </p>
                  </div>
                </Card>
              );
            })}
        </Grid>
        {onselect && (
          <>
            <Grid item lg={5} sx={{ width: '100%' }}>
              {onselect && (
                <>
                  <Space size={12}>
                    <Image
                      width={200}
                      src={`${lien_image}/${onselect.file}`}
                      placeholder={<Image preview={false} src={`${lien_image}/${onselect.file}`} width={200} />}
                    />
                  </Space>
                  <>
                    <div className="demandeJsx" style={{ textAlign: 'justify' }}>
                      {onselect.codeclient !== 'undefined' && (
                        <Typography component="p" className="codeClient" style={{ fontSize: '15px', fontWeight: 'bolder' }}>
                          code client : {onselect.codeclient && onselect.codeclient.toUpperCase()}
                        </Typography>
                      )}

                      {onselect.numero !== 'undefined' && <p>Numéro joignable du client: {onselect.numero}</p>}

                      <p>Statut du client : {`${onselect.statut === 'allumer' ? 'allumé' : 'éteint'}`} </p>
                      <p>Sector : {onselect?.sector} </p>
                      <p>Cell : {onselect?.cell} </p>
                      <p>Sat : {onselect?.sat} </p>
                      <p>Reference : {onselect?.reference} </p>
                      <p>Feedback : {onselect.raison.toLowerCase()}</p>
                    </div>
                  </>
                </>
              )}
              {onselect && <Chat demandes={onselect.conversation.reverse()} />}
            </Grid>
            <Grid item lg={4}>
              <div style={{ marginBottom: '10px' }}>
                <TextArea
                  required
                  value={feedback}
                  onChange={(e) => {
                    setFeedback(e.target.value);
                  }}
                  placeholder="Reason why you reject the visit"
                  autoSize={{
                    minRows: 3,
                    maxRows: 5
                  }}
                />
              </div>
              <Grid container>
                <Grid item lg={6} sx={{ padding: '2px' }}>
                  <Button onClick={() => Approved('approved')} fullWidth color="primary" variant="contained">
                    Approved
                  </Button>
                </Grid>
                <Grid item lg={6} sx={{ padding: '2px' }}>
                  <Button onClick={() => Approved('rejected')} fullWidth color="warning" variant="contained">
                    Not Approved
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
}

export default Approbation;
