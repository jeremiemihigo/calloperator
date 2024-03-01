/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField, Grid } from '@mui/material';
import React, { useContext } from 'react';
import { Edit, Save } from '@mui/icons-material';
import axios from 'axios';
import { postReponse } from 'Redux/Reponses';
import { lien, config } from 'static/Lien';
import { CreateContexte } from 'Context';
import { Alert } from '../../../node_modules/@mui/lab/index';

function ReponsesComponent({ update }) {
  const [intial, setInitial] = React.useState({
    codeCu: '',
    codeClient: '',
    consExpDays: '',
    nomClient: '',
    region: '',
    shop: ''
  });
  const onChange = (e) => {
    const { name, value } = e.target;
    setInitial({
      ...intial,
      [name]: value
    });
  };
  const { demande } = useContext(CreateContexte);
  const { codeCu, codeClient, consExpDays, nomClient, region, shop } = intial;
  let [status, setStatut] = React.useState({ payement: '', statut: '' });
  const { payement, statut } = status;
  const [message, setMessage] = React.useState('');
  const [openSnack, setOpenSnack] = React.useState(false);

  function reset() {
    setInitial({ codeCu: '', codeClient: '', consExpDays: '', shop: '', region: '', nomClient: '' });
    setStatut({ payement: '', statut: '' });
  }

  const reponse = useSelector((state) => state.reponse);

  const checkStatut = (chiffre) => {
    setInitial({
      ...intial,
      consExpDays: chiffre
    });
    let statut = '';
    let payement = '';
    if (chiffre >= 0) {
      statut = 'installed';
      payement = 'normal';
    }
    if (chiffre >= -30 && chiffre <= -1) {
      statut = 'installed';
      payement = 'expired';
    }
    if (chiffre >= -44 && chiffre <= -31) {
      statut = 'installed';
      payement = 'defaulted';
    }
    if (chiffre <= -45) {
      statut = 'pending repossession';
      payement = 'defaulted';
    }
    if (isNaN(chiffre)) {
      statut = '';
      payement = '';
    }
    setStatut({ payement, statut });
    return { payement, statut };
  };

  const parametres = useSelector((state) => state.parametre);
  React.useEffect(() => {
    if (codeClient !== '') {
      setStatut({ payement: '', statut: '' });

      let cus = parametres.parametre.filter((x) => x.customer === codeClient);

      if (cus.length > 0) {
        setInitial({
          ...intial,
          codeCu: cus[0].customer_cu,
          nomClient: cus[0].nomClient,
          region: cus[0].region,
          shop: cus[0].shop,
          consExpDays: ''
        });
      } else {
        setInitial({
          ...intial,
          codeCu: '',
          nomClient: '',
          consExpDays: '',
          region: '',
          shop: ''
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeClient]);

  const userConnect = useSelector((state) => state.user?.user);
  const dispatch = useDispatch();
  const reponseData = (e) => {
    if (userConnect && userConnect.fonction !== 'co') {
      setMessage('Cette espace est reservée aux C.O');
      setOpenSnack(true);
    } else {
      e.preventDefault();
      const datass = {
        idDemande: demande.idDemande,
        codeClient,
        codeCu,
        codeAgent: userConnect?.codeAgent,
        clientStatut: statut,
        PayementStatut: payement,
        consExpDays,
        nomClient,
        region,
        shop
      };
      dispatch(postReponse(datass));
      reset();
    }
  };
  const modifier = async () => {
    setOpenSnack(false);

    axios
      .put(
        lien + '/reponse',
        {
          idReponse: update._id,
          data: {
            codeClient,
            nomClient,
            codeCu,
            clientStatut: statut,
            PayementStatut: payement,
            consExpDays
          }
        },
        config
      )
      .then((response) => {
        setMessage(response.data);
        reset();
        setOpenSnack(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  React.useEffect(() => {
    if (update) {
      let valeur = {
        consExpDays: update.consExpDays,
        codeClient: update.codeClient,
        codeCu: update.codeCu
      };

      checkStatut(update.consExpDays);
      setInitial({
        ...intial,
        ...valeur
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  return (
    <Grid>
      {reponse.postDemande === 'rejected' && <Alert severity="warning">{reponse.postDemandeError}</Alert>}
      {openSnack && <Alert severity="warning">{message}</Alert>}

      <TextField
        style={{ marginTop: '10px' }}
        onChange={(e) => onChange(e)}
        name="codeClient"
        autoComplete="off"
        fullWidth
        value={codeClient}
        label="Code du Client"
      />
      <TextField
        style={{ marginTop: '10px' }}
        onChange={(e) => onChange(e)}
        name="nomClient"
        autoComplete="off"
        fullWidth
        value={nomClient}
        label="Nom du Client"
      />
      <TextField
        style={{ marginTop: '10px' }}
        onChange={(e) => onChange(e)}
        value={codeCu}
        name="codeCu"
        autoComplete="off"
        fullWidth
        label="Code CU"
      />
      <Grid container sx={{ marginTop: '10px' }}>
        <Grid item lg={6}>
          <TextField
            style={{ marginTop: '10px', paddingRight: '5px' }}
            onChange={(e) => onChange(e)}
            value={region}
            name="region"
            autoComplete="off"
            fullWidth
            label="Région"
          />
        </Grid>
        <Grid item lg={6}>
          <TextField
            style={{ marginTop: '10px' }}
            onChange={(e) => onChange(e)}
            value={shop}
            name="shop"
            autoComplete="off"
            fullWidth
            label="Shop"
          />
        </Grid>
      </Grid>
      <div className="expiredDate">
        <TextField
          onChange={(e) => checkStatut(e.target.value)}
          style={{ marginTop: '10px' }}
          name="consExpDays"
          autoComplete="off"
          fullWidth
          value={consExpDays}
          label="consExpDays"
        />
      </div>
      <TextField
        style={{ marginTop: '10px' }}
        onChange={(e) => {
          e.preventDefault();
          setStatut({
            ...status,
            statut: e.target.value
          });
        }}
        name="statut"
        autoComplete="off"
        fullWidth
        value={statut}
        label="Statut du client"
      />
      <TextField
        style={{ marginTop: '10px' }}
        onChange={(e) => {
          e.preventDefault();
          setStatut({
            ...status,
            payement: e.target.value
          });
        }}
        name="payement"
        autoComplete="off"
        fullWidth
        value={payement}
        label="Statut Payement"
      />
      <div style={{ marginTop: '10px' }}>
        <Button
          disabled={!demande && !update ? true : false}
          fullWidth
          variant="contained"
          color="primary"
          onClick={update ? () => modifier() : (e) => reponseData(e)}
        >
          {update ? <Edit fontSize="small" /> : <Save fontSize="small" />}{' '}
          <span style={{ marginLeft: '10px' }}> {update ? 'Update' : 'Save'}</span>
        </Button>
      </div>
    </Grid>
  );
}
export default ReponsesComponent;
