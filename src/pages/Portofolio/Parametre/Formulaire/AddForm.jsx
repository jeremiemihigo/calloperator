import { Button, Typography } from '@mui/material';
import Input from 'components/Input';
import SimpleBackdrop from 'Control/Backdrop';
import DirectionSnackbar from 'Control/SnackBar';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AjouterFormulaire } from 'Redux/formulaire';

function AddForm() {
  const [value, setValue] = React.useState('');
  const formular = useSelector((state) => state.formulaire);

  const dispatch = useDispatch();

  const sendData = async () => {
    try {
      dispatch(AjouterFormulaire({ titre: value }));
      setValue('');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {formular.addformulaire === 'pending' && <SimpleBackdrop open={true} title="Please wait..." taille="10rem" />}
      {formular.addformulaire === 'success' && <DirectionSnackbar message="Opération effectuée" />}
      {formular.addformulaire === 'rejected' && <DirectionSnackbar message={formular.addformulaireError} />}

      <Typography component="p" sx={{ marginBottom: '10px' }}>
        Ajouter un formulaire
      </Typography>
      <Input label="Nom du formulaire" setValue={setValue} value={value} showIcon={false} />
      <Button onClick={() => sendData()} variant="contained" color="primary" fullWidth sx={{ marginTop: '10px' }}>
        Valider
      </Button>
    </>
  );
}

export default AddForm;
