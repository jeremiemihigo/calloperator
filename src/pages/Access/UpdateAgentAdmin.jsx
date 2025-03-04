/* eslint-disable react/prop-types */
import { Add, Edit } from '@mui/icons-material';
import { Button, FormHelperText, Grid, OutlinedInput, Stack } from '@mui/material';
import AutoComplement from 'Control/AutoComplet';
import { OtherUpdated } from 'Redux/AgentAdmin';
import { Formik } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Selected from 'static/Select';
import * as Yup from 'yup';

function UpdateAgentAdmin({ agent }) {
  const dispatch = useDispatch();
  const roles = useSelector((state) => state.role.role);
  const [roleSelect, setRole] = React.useState('');
  const region = useSelector((state) => state.zone.zone);
  const shop = useSelector((state) => state.shop.shop);
  const [regionSelect, setRegionSelect] = React.useState('');
  const [shopSelect, setShopSelect] = React.useState('');
  const [allFilterRegion, setAllFilterRegion] = React.useState([]);
  const [allFilterShop, setAllFilterShop] = React.useState([]);

  const fonction = [
    { id: 1, title: 'Super utilisateur', value: 'superUser' },
    { id: 2, title: 'Admin', value: 'admin' },
    { id: 3, title: 'Call operator', value: 'co' }
  ];
  const [fonctionSelect, setFonctionSelect] = React.useState('');

  const adddataFilterRegion = () => {
    setAllFilterShop([]);
    let d = regionSelect?.denomination;
    if (!allFilterRegion.includes(d)) {
      setAllFilterRegion([...allFilterRegion, d]);
    }
  };
  const adddataFilterShop = () => {
    let d = shopSelect?.shop;
    setAllFilterRegion([]);
    if (!allFilterShop.includes(d)) {
      setAllFilterShop([...allFilterShop, d]);
    }
  };

  React.useEffect(() => {
    if (agent) {
      let myrole = roles.filter((x) => x.idRole === agent.role);
      if (myrole.length > 0) {
        setRole(myrole[0]);
      }
      if (myrole.filterBy === 'shop') {
        setAllFilterShop(agent?.valueFilter);
      }
      if (myrole.filterBy === 'region') {
        setAllFilterRegion(agent?.valueFilter);
      }
    }
    setFonctionSelect(agent?.fonction);
  }, [agent]);
  return (
    <div style={{ width: '25rem' }}>
      <Formik
        initialValues={{
          nom: agent?.nom,
          code: agent?.codeAgent
        }}
        validationSchema={Yup.object().shape({
          nom: Yup.string().max(255).required('Le nom est obligatoire'),
          code: Yup.string().max(20).required('Le code est obligatoire')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const donner = {
              unset: {},
              data: {
                role: roleSelect?.idRole,
                nom: values.nom,
                fonction: fonctionSelect,
                valueFilter: roleSelect?.filterBy === 'region' ? allFilterRegion : allFilterShop
              },
              idAgent: agent._id
            };
            dispatch(OtherUpdated(donner));
          } catch (error) {
            setStatus({ success: false });
            setErrors({ submit: error.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <OutlinedInput
                    id="nom"
                    type="text"
                    value={values.nom}
                    name="nom"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Entrez le nom de l'agent"
                    fullWidth
                    error={Boolean(touched.nom && errors.nom)}
                  />
                  {touched.nom && errors.nom && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.nom}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Selected label="Fonction" data={fonction} value={fonctionSelect} setValue={setFonctionSelect} />
              </Grid>
              <Grid item xs={12}>
                {roles ? (
                  <AutoComplement value={roleSelect} setValue={setRole} options={roles} title="Selectionnez le role" propr="title" />
                ) : (
                  <p style={{ textAlign: 'center' }}>Loading...</p>
                )}
              </Grid>
              {roleSelect && roleSelect.filterBy === 'region' && (
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item lg={10} sx={{ paddingRight: '10px' }}>
                      <AutoComplement
                        value={regionSelect}
                        setValue={setRegionSelect}
                        options={region}
                        title="Selectionnez la region"
                        propr="denomination"
                      />
                    </Grid>
                    <Grid item lg={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Button onClick={(e) => adddataFilterRegion(e)} variant="contained" color="primary" fullWidth>
                        <Add fontSize="small" />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {roleSelect && roleSelect.filterBy === 'shop' && (
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item lg={10} sx={{ paddingRight: '10px' }}>
                      <AutoComplement
                        value={shopSelect}
                        setValue={setShopSelect}
                        options={shop}
                        title="Selectionnez le Shop"
                        propr="shop"
                      />
                    </Grid>
                    <Grid item lg={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Button onClick={(e) => adddataFilterShop(e)} variant="contained" color="primary" fullWidth>
                        <Add fontSize="small" />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              )}
              <Grid container>
                {allFilterRegion.map((index) => {
                  return <span key={index}>{index + '; '}</span>;
                })}
                {allFilterShop.map((index) => {
                  return <span key={index}>{index + '; '}</span>;
                })}
              </Grid>

              <Grid item xs={12}>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="info">
                  <Edit fontSize="small" />
                  <span style={{ marginLeft: '10px' }}>Edit</span>
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default UpdateAgentAdmin;
