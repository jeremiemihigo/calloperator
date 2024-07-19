/* eslint-disable react/prop-types */
import { Button, FormHelperText, Grid, OutlinedInput, Stack } from '@mui/material';
import { AjouterAgentAdmin } from 'Redux/AgentAdmin';
import { Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import Selected from 'static/Select';
import * as Yup from 'yup';

function AgentAdmin() {
  const dispatch = useDispatch();

  const fonction = [
    { id: 1, title: 'Super utilisateur', value: 'superUser' },
    { id: 2, title: 'Admin', value: 'admin' },
    { id: 3, title: 'Call operator', value: 'co' }
  ];
  const [fonctionSelect, setFonctionSelect] = React.useState('');
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
            const data = {
              nom: values.nom,
              fonction: fonctionSelect,
              codeAgent: values.code
            };
            dispatch(AjouterAgentAdmin(data));
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
