import PropTypes from 'prop-types';
// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

const AnalyticEcommerce = ({ title, count }) => (
  <MainCard contentSX={{ p: 2.25 }}>
    <Stack spacing={0.5}>
      <Typography variant="h6" color="textSecondary">
        {title}
      </Typography>
      <Grid container alignItems="center">
        <Grid item>
          {count ? (
            <Typography variant="h4" color="inherit">
              {count}
            </Typography>
          ) : (
            <Typography variant="h6" sx={{ textAlign: 'center' }} color="inherit">
              Loading
            </Typography>
          )}
        </Grid>
      </Grid>
    </Stack>
  </MainCard>
);
AnalyticEcommerce.propTypes = {
  title: PropTypes.string,
  count: PropTypes.string
};

AnalyticEcommerce.defaultProps = {
  color: 'primary'
};

export default AnalyticEcommerce;
