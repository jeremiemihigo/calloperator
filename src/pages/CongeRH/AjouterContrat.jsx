import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AutoComplement from 'Control/AutoComplet';
import { Input, Button } from 'antd';
import { Grid } from '@mui/material';
import { AjouterContrat } from 'Redux/Contrat';

function AjouterContrats() {
  //codeAgent, debut, fin, soldeConge
  const agent = useSelector((state) => state.agentAdmin);
  const [initial, setInitial] = React.useState({ debut: '', fin: '', soldeConge: '' });
  const { debut, fin, soldeConge } = initial;
  const dispatch = useDispatch();
  const [value, setValue] = React.useState('');
  const [loadings, setLoadings] = React.useState([]);

  const enterLoading = async (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    if (value !== '' && soldeConge !== '') {
      let data = {
        codeAgent: value.codeAgent,
        debut,
        fin,
        soldeConge
      };
      dispatch(AjouterContrat(data));
      setInitial({ debut: '', fin: '', soldeConge: '' });
      setValue('');
    }
    // code

    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = false;
      return newLoadings;
    });
  };
  return (
    <div style={{ width: '25rem' }}>
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        {agent?.agentAdmin.length < 1 ? (
          <p>Loading agent...</p>
        ) : (
          <AutoComplement value={value} setValue={setValue} options={agent?.agentAdmin} title="Recherche agent *" propr="nom" />
        )}
      </div>

      <div>
        <Input placeholder="Début contrat" onChange={(e) => setInitial({ ...initial, debut: e.target.value })} type="date" />
      </div>
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Input placeholder="Fin contrat" onChange={(e) => setInitial({ ...initial, fin: e.target.value })} type="date" />
      </div>
      <div>
        <Input placeholder="Solde congé *" onChange={(e) => setInitial({ ...initial, soldeConge: e.target.value })} type="number" />
      </div>
      <Grid sx={{ marginTop: '12px' }}>
        <Button type="primary" loading={loadings[0]} onClick={() => enterLoading(0)}>
          Enregistrer
        </Button>
      </Grid>
    </div>
  );
}

export default AjouterContrats;
