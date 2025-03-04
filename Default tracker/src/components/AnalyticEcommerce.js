/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
// material-ui
import { Grid, Paper, Typography } from '@mui/material';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
// project import

// assets

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

const AnalyticEcommerce = ({ title, count, bg }) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: '' + texte,
      duration: 3
    });
  };
  const navigationManagment = (action) => {
    if (count.length > 0) {
      navigate('/liste', { state: { visites: count, action: title } });
    } else {
      success('no customers for this status', 'error');
    }
  };
  return (
    <Paper onClick={(e) => navigationManagment(e)} sx={{ padding: '4px', cursor: 'pointer', marginBottom: '2px' }}>
      {contextHolder}
      <div style={{ minWidth: '5rem' }}>
        <Grid container>
          <Grid item lg={10} xs={10} sm={10} md={10}>
            <Typography component="p" sx={{ fontSize: '12px', fontWeight: 'bolder' }} noWrap>
              {title}
            </Typography>
          </Grid>
          <Grid item lg={2} xs={2} sm={2} md={2} sx={{ background: '#002d72', borderRadius: '20px', textAlign: 'center', color: 'white' }}>
            <Typography component="p">{count?.length}</Typography>
          </Grid>
        </Grid>
        <Grid>
          <Typography component="p" sx={{ fontSize: '12px' }}>
            {count[0].role[0].title}
          </Typography>
        </Grid>
        <Grid container alignItems="center">
          <Grid item lg={4} xs={4} sx={{ padding: '4px' }}>
            <div style={{ background: '#DCF5D0', color: '#000', padding: '5px', borderRadius: '10px' }}>
              <Typography variant="h6" sx={{ textAlign: 'center', fontSize: '6px', margin: '0px', padding: '0px' }} color="inherit">
                IN SLA
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bolder' }} color="inherit">
                {bg.nombreIn}
              </Typography>
            </div>
          </Grid>
          <Grid item lg={4} xs={4} sx={{ padding: '4px' }}>
            <div style={{ background: '#F6B0AA', color: '#000', padding: '5px', borderRadius: '10px' }}>
              <Typography variant="h6" sx={{ textAlign: 'center', fontSize: '6px' }} color="inherit">
                OUT SLA
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bolder' }} color="inherit">
                {bg.nombreOut}
              </Typography>
            </div>
          </Grid>
          <Grid item lg={4} xs={4} sx={{ padding: '5px' }}>
            <div style={{ background: '#FEF6AA', padding: '5px', borderRadius: '10px' }}>
              <Typography variant="h6" sx={{ textAlign: 'center', fontSize: '6px' }} color="inherit">
                Today
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bolder' }} color="inherit">
                {bg.today}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
};
AnalyticEcommerce.propTypes = {
  title: PropTypes.string,
  bg: PropTypes.object,
  count: PropTypes.array
};

export default AnalyticEcommerce;
