import React from 'react';
import { Paper, TextField, Button } from '@mui/material';
import Table from './Table';
import { useDispatch } from 'react-redux';
import { AddRaison } from 'Redux/Raison';

function Index() {
  const [raison, setRaison] = React.useState('');
  const dispatch = useDispatch();
  const addRaisons = (e) => {
    e.preventDefault();
    try {
      dispatch(AddRaison({ raison, codeAgent: localStorage.getItem('bboxxSupportCodeAgent') }));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ width: '50%', padding: '10px' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '70%' }}>
            <TextField fullWidth placeholder="Raison" value={raison} onChange={(e) => setRaison(e.target.value)} />
          </div>
          <Button onClick={(e) => addRaisons(e)} variant="contained" color="primary" sx={{ marginLeft: '10px' }}>
            Save
          </Button>
        </div>
        <div>
          <Table />
        </div>
      </Paper>
    </div>
  );
}
export default Index;
