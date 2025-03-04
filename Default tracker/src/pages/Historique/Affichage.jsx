import { Grid, Paper, Typography } from '@mui/material';
import { Image, Space } from 'antd';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { lien_image } from 'static/Lien';
import { returnFeedback, returnMoisLetter, returnRole } from 'utils/function';

function Affichage({ data }) {
  const roles = useSelector((state) => state.role.role);
  const feedback = useSelector((state) => state.feedback.feedback);
  return (
    <Grid container>
      <Grid item lg={12} className="gridContent">
        <div className="enteteclient">
          <p>{data[0]?.nomclient}</p>
        </div>
        <div className="enteteclient">
          <p>{data[0]?.codeclient}</p>
        </div>
      </Grid>

      {data.map((index) => {
        return (
          <Grid container key={index._id}>
            <Grid item lg={8} sx={{ padding: '2px' }}>
              <Paper elevation={3} sx={{ padding: '10px', marginTop: '5px' }}>
                <div className="grandItem">
                  <div className="information">
                    <p>
                      <span style={{ opacity: 0.5 }}>Month</span> :{' '}
                      {returnMoisLetter(index.month.split('-')[0]) + index.month.split('-')[1]}
                      <span style={{ marginLeft: '10px' }}>Last status </span>
                      <span style={{ fontWeight: 'bolder' }}>{index.currentfeedback?.title}</span>
                    </p>
                    <p>
                      {' '}
                      <span style={{ opacity: 0.5 }}>Region</span> : {index.region}
                    </p>
                    <p>
                      {' '}
                      <span style={{ opacity: 0.5 }}>Shop</span> : {index.shop}
                    </p>
                    <p>
                      <span style={{ opacity: 0.5 }}>Par</span> : {index.par}
                    </p>
                  </div>
                  <div>
                    {index.feedback.map((item) => {
                      return (
                        <div key={item._id} className="affichefeedback">
                          <Typography component="p" noWrap>
                            role <span>{returnRole(roles, item.role) + '; '}</span> Enregistré {moment(new Date(item.createdAt)).fromNow()}
                          </Typography>
                          <Typography component="p" noWrap>
                            Last <span>{returnFeedback(feedback, item.lasFeedback)}</span>
                          </Typography>
                          <Typography component="p" noWrap>
                            change to <span>{returnFeedback(feedback, item.newFeedback)}</span>
                          </Typography>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Paper>
            </Grid>
            <Grid item lg={4} sx={{ padding: '2px' }}>
              <Paper sx={{ padding: '10px', marginTop: '5px' }} elevation={3}>
                {index.visites.length > 0 ? (
                  index.visites.map((item) => {
                    return (
                      <div key={item._id} className="visite">
                        <div className="client">
                          <p>payment status : {item.PayementStatut}</p>
                          <p>customer status : {item.clientStatut}</p>
                          <p>Expired days {item.consExpDays}</p>
                        </div>
                        <div className="visiteinfo_div">
                          <div className="visiteinfo">
                            <p>Raison : {item.demande.raison}</p>
                            <p>Date : {moment(item.demande.updatedAt).format('DD MMMM YYYY')}</p>
                            <Typography noWrap component="p">
                              Visited by : {item.demandeur.codeAgent + '; ' + item.demandeur.nom}
                            </Typography>
                          </div>
                          <div className="visiteImage">
                            <Space size={5}>
                              <Image
                                width={50}
                                height={50}
                                src={`${lien_image}/${item.demande.file}`}
                                placeholder={<Image preview={false} src={`${lien_image}/${item.demande.file}`} width={100} />}
                              />
                            </Space>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ textAlign: 'center' }}>Aucune visite</p>
                )}
              </Paper>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default Affichage;
