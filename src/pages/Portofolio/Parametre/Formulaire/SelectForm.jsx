import { Typography } from '@mui/material';
import axios from 'axios';
import AutoComplement from 'Control/AutoComplet';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, portofolio } from 'static/Lien';
import { ContextParametre } from '../Context';

function SelectForm() {
  const formular = useSelector((state) => state.formulaire.formulaire);
  const { setLoadQuestion, formSelect, setFormSelect, setData } = React.useContext(ContextParametre);

  const loading = async () => {
    try {
      setLoadQuestion(true);
      const response = await axios.get(portofolio + '/readQuestionFormular/' + formSelect?.idFormulaire, config);
      if (response.status === 200) {
        setData(response.data);
        setLoadQuestion(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, [formSelect]);
  return (
    <>
      <Typography component="p" sx={{ marginBottom: '10px' }}>
        Selectionnez un formulaire
      </Typography>
      <AutoComplement id="_id" value={formSelect} setValue={setFormSelect} options={formular} title="Formulaire" propr="titre" />
    </>
  );
}

export default SelectForm;
