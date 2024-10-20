import { CircularProgress, Grid, Typography } from '@mui/material';
import { CreateContexteGlobal } from 'GlobalContext';
import React from 'react';
import { useSelector } from 'react-redux';
import { CreateContexteTable } from './Contexte';
import Dashboard from './Dashboard';
import DetailPlainte from './DetailPlainte';
import IndexForm from './IndexForm';
import './style.css';
import BackOffice from './Table/BackOffice';
import Conversation from './Table/Conversation';
import CreateComplaint from './Table/CreateComplaint';
import MyBackOffice from './Table/MyBackOffice';
import Recherche from './Table/Recherche';
import ThisMonth from './Table/ThisMonth';
import ThisMonth_Tech from './Table/ThisMonth_Tech';

function Index() {
  const { select, setSelect, annuler } = React.useContext(CreateContexteTable);
  const { client } = React.useContext(CreateContexteGlobal);
  const user = useSelector((state) => state.user?.user);

  const [property, setProperty] = React.useState();
  React.useEffect(() => {
    if (user.plainte_callcenter) {
      setProperty('callcenter');
    }
    if (user.plainteShop) {
      setProperty('shop');
    }
  }, [user]);

  return (
    <Grid>
      <Grid className="divAppel" component="div">
        <Grid
          onClick={() => {
            annuler();
            setSelect(7);
          }}
          className={`${select === 7 && 'select'} titres`}
        >
          <p>Dashboard</p>
        </Grid>
        {user && (user.plainte_callcenter || user.plainteShop) && (
          <Grid
            onClick={() => {
              annuler();
              setSelect(1);
            }}
            className={`${select === 1 && 'select'} titres`}
          >
            <p>Create one</p>
          </Grid>
        )}
        <Grid
          onClick={() => {
            annuler();
            setSelect(0);
          }}
          className={`${select === 0 && 'select'} titres`}
          sx={{ width: '10rem' }}
        >
          <Typography component="p" noWrap>
            No technical Issues
          </Typography>
          <Typography component="p" className="nbre">
            {client && client.length > 0 && client.filter((x) => x.type === 'appel' && x.statut !== 'escalade').length}
            {client && client.length === 0 && <CircularProgress size={10} />}
          </Typography>
        </Grid>
        <Grid
          onClick={() => {
            annuler();
            setSelect(5);
          }}
          className={`${select === 5 && 'select'} titres`}
          sx={{ width: '10rem' }}
        >
          <Typography component="p" noWrap>
            Technical Issues
          </Typography>
          <Typography component="p" className="nbre">
            {client && client.length > 0 && client.filter((x) => x.type === 'ticket').length}
            {client && client.length == 0 && <CircularProgress size={10} />}
          </Typography>
        </Grid>

        {user.backOffice_plainte && (
          <Grid
            onClick={() => {
              annuler();
              setSelect(2);
            }}
            className={`${select === 2 && 'select'} titres`}
          >
            <Typography component="p">Back office</Typography>
            <Typography component="p" className="nbre">
              {client && client.length > 0 && client.filter((x) => x?.operation === 'backoffice').length}
              {client && client.length == 0 && <CircularProgress size={10} />}
            </Typography>
          </Grid>
        )}
        {!user.backOffice_plainte && (
          <Grid
            onClick={() => {
              annuler();
              setSelect(8);
            }}
            className={`${select === 8 && 'select'} titres`}
          >
            <Typography component="p">Back office</Typography>
          </Grid>
        )}
        {(user.fonction === 'co' || user.fonction === 'superUser') && (
          <Grid
            onClick={() => {
              annuler();
              setSelect(4);
            }}
            className={`${select === 4 && 'select'} titres`}
          >
            <Typography component="p">Relocation</Typography>
            <Typography component="p" className="nbre">
              {client && client.length > 0 && client.filter((x) => x?.statut === 'awaiting_confirmation').length}
              {client && client.length === 0 && <CircularProgress size={10} color="inherit" />}
            </Typography>
          </Grid>
        )}
        <Grid
          onClick={() => {
            annuler();
            setSelect(9);
          }}
          className={`${select === 9 && 'select'} titres`}
        >
          <Typography component="p">Search</Typography>
        </Grid>
      </Grid>
      {select === 0 && <ThisMonth />}
      {select === 1 && property && <IndexForm property={property} />}
      {select === 2 && <BackOffice />}
      {select === 3 && <Conversation />}
      {select === 4 && <CreateComplaint />}
      {select === 5 && <ThisMonth_Tech />}
      {select === 6 && <DetailPlainte />}
      {select === 7 && <Dashboard />}
      {select === 8 && <MyBackOffice />}
      {select === 9 && <Recherche />}
    </Grid>
  );
}
export default React.memo(Index);
