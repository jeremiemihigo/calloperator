// material-ui
import { Grid } from '@mui/material';
import AuthWrapper from './AuthWrapper';
import AuthLogin from './auth-forms/AuthLogin';

// ================================|| LOGIN ||================================ //

const Login = () => (
  <AuthWrapper>
    <Grid container>
      <Grid item xs={12}>
        <AuthLogin />
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default Login;
