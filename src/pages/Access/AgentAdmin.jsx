/* eslint-disable react/prop-types */
import * as Yup from 'yup';
import { Formik } from 'formik';
import React from 'react';
import { FormHelperText, Grid, Button, OutlinedInput, Stack } from '@mui/material';
import Selected from 'static/Select';
import { useDispatch } from 'react-redux';
import { AjouterAgentAdmin } from 'Redux/AgentAdmin';

function AgentAdmin() {
  const donner = [
    { id: 1, title: 'Supeur utilisateur', value: 'superUser' },
    { id: 2, title: 'Administrateur', value: 'admin' },
    { id: 3, title: 'Call operator', value: 'co' }
  ];
  const [fonctionSelect, setFonctionSelect] = React.useState('');
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={{
        nom: '',
        telephone: '',
        code: ''
      }}
      validationSchema={Yup.object().shape({
        nom: Yup.string().max(255).required('Le nom est obligatoire'),
        telephone: Yup.string().max(10).required('Le numero de téléphone est obligatoire'),
        code: Yup.string().max(20).required('Le code est obligatoire')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          dispatch(
            AjouterAgentAdmin({
              nom: values.nom,
              fonction: fonctionSelect,
              telephone: values.telephone,
              code: values.code
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
                  id="telephone"
                  type="text"
                  value={values.telephone}
                  name="telephone"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Contact; +243"
                  fullWidth
                  error={Boolean(touched.telephone && errors.telephone)}
                />
                {touched.telephone && errors.telephone && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.telephone}
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
              <Selected label="Selectionnez la fonction" data={donner} value={fonctionSelect} setValue={setFonctionSelect} />
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
  );
}

export default AgentAdmin;
