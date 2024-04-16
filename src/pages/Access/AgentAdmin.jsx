/* eslint-disable react/prop-types */
import * as Yup from 'yup';
import { Formik } from 'formik';
import React from 'react';
import { FormHelperText, Grid, Button, OutlinedInput, Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { AjouterAgentAdmin } from 'Redux/AgentAdmin';
import axios from 'axios';
import { lien } from 'static/Lien';
import AutoComplement from 'Control/AutoComplet';

function AgentAdmin() {
  const dispatch = useDispatch();
  const [listeDepartement, setListeDepartement] = React.useState();
  const [departement, setDepartement] = React.useState('');
  const loadingDepartement = async () => {
    setListeDepartement();
    try {
      const response = await axios.get(lien + '/departement');
      if (response.status === 200) {
        setListeDepartement(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loadingDepartement();
  }, []);
  return (
    <div style={{ width: '25rem' }}>
      <Formik
        initialValues={{
          nom: '',
          code: ''
        }}
        validationSchema={Yup.object().shape({
          nom: Yup.string().max(255).required('Le nom est obligatoire'),
          code: Yup.string().max(20).required('Le code est obligatoire')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            dispatch(
              AjouterAgentAdmin({
                nom: values.nom,
                fonction: fonctionSelect,
                code: values.code,
                departement: departement.idDepartement
              })
            );
          } catch (error) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
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
                <Stack>
                  <OutlinedInput
                    id="code"
                    type="text"
                    value={values.code}
                    name="code"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Nom d'utilisateur"
                    fullWidth
                    error={Boolean(touched.code && errors.code)}
                  />
                  {touched.code && errors.code && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.code}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <AutoComplement
                  value={departement}
                  setValue={setDepartement}
                  options={listeDepartement}
                  title="Département"
                  propr="departement"
                />
              </Grid>

              <Grid item xs={12}>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                  Enregistrer
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default AgentAdmin;
