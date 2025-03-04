import { Grid, Typography } from '@mui/material';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { returnFeedback } from 'utils/function';
import { Paper } from '../../../node_modules/@mui/material/index';
import './allchild.css';

function Feedback({ client }) {
  const { nomclient, codeclient, decision, actions, Hist_Arbitrage, par, region, shop, statut_decision } = client;
  const feed = useSelector((state) => state.feedback.feedback);
  return (
    <Grid style={{ marginTop: '10px' }} container>
      <Grid item lg={3}>
        <Paper elevation={2} sx={{ height: '100%' }}>
          <div className="content">
            <p className="name">{nomclient}</p>
            <p>Customer id : {codeclient}</p>
            <p>Region {region}</p>
            <p>Shop {shop}</p>
            <p>PAR {par}</p>
            <p>{statut_decision}</p>
          </div>
        </Paper>
      </Grid>
      <Grid item lg={3} sx={{ padding: '2px' }}>
        <p className="entete">Arbitrage</p>
        {Hist_Arbitrage &&
          Hist_Arbitrage.map((index) => {
            return (
              <div key={index._id} className="feedbackdiv">
                <Typography component="p">
                  Current status <span>{' : ' + returnFeedback(feed, index.current_status)}</span>
                </Typography>
                <Typography component="p">
                  Change to
                  <span>{' : ' + returnFeedback(feed, index.changeto)}</span>
                </Typography>
                <Typography component="p">
                  submited by
                  <span>{' : ' + index.submitedBy}</span>
                </Typography>
                <Typography component="p">
                  checked By
                  <span>{' : ' + index.checkedBy}</span>
                </Typography>
                <Typography component="p">
                  commentaire
                  <span>{' : ' + index.commentaire}</span>
                </Typography>
              </div>
            );
          })}
      </Grid>
      <Grid item lg={3} sx={{ padding: '2px' }}>
        <p className="entete">Decisions</p>
        {decision.length > 0 &&
          decision[0].validate.map((index) => {
            return (
              <div key={index._id} className="feedbackdiv">
                <Typography component="p">
                  last_statut <span>{' : ' + returnFeedback(feed, index.last_statut)}</span>
                </Typography>
                <Typography component="p">
                  next_statut
                  <span>{' : ' + returnFeedback(feed, index.next_statut)}</span>
                </Typography>
                <Typography component="p">
                  commentaire
                  <span>{' : ' + index.commentaire}</span>
                </Typography>
                <Typography component="p" className="name_createdAt">
                  <span>Do by{' : ' + index.createdBy}</span>
                  <span className="createdAt">{moment(index.createdAt).fromNow()}</span>
                </Typography>
              </div>
            );
          })}
      </Grid>
      <Grid item lg={3} sx={{ padding: '2px' }}>
        <p className="entete">Action</p>
        {actions.length > 0 &&
          actions[0].statuschangeBy.map((index) => {
            return (
              <div key={index._id} className="feedbackdiv">
                <Typography component="p">
                  last_statut <span>{' : ' + index.last_statut}</span>
                </Typography>
                <Typography component="p" className="name_createdAt">
                  <span>
                    next_statut
                    <span style={{ fontWeight: 'bolder' }}>{' : ' + index.next_statut}</span>
                  </span>
                  <span className="createdAt">{moment(index.createdAt).fromNow()}</span>
                </Typography>

                <Typography component="p">
                  commentaire
                  <span>{' : ' + index.commentaire}</span>
                </Typography>
              </div>
            );
          })}
      </Grid>
    </Grid>
  );
}

export default Feedback;
