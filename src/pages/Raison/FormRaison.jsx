/* eslint-disable react/prop-types */
import React from 'react';
import { TextField, Button } from '@mui/material';
import { AddRaison, updateRaison } from 'Redux/Raison';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Space } from 'antd';

function FormRaison({ raisonUpdate, id }) {
  const [raison, setRaison] = React.useState('');
  const user = useSelector((state) => state.user);
  const raisonStore = useSelector((state) => state.raison);
  const dispatch = useDispatch();

  const addRaisons = (e) => {
    e.preventDefault();
    try {
      if ((user && user.readUser === 'rejected') || user?.user.length < 1) {
        localStorage.removeItem('auth');
        window.location.replace('/login');
      } else {
        dispatch(AddRaison({ raison, codeAgent: user.user.codeAgent }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const update = async (e) => {
    e.preventDefault();
    dispatch(updateRaison({ id, raison }));
  };
  React.useEffect(() => {
    if (raisonUpdate && id) {
      setRaison(raisonUpdate);
    }
  }, [id, raisonUpdate]);

  return (
    <div>
      {raisonStore.postRaison === 'success' ||
        (raisonStore.updateRaison === 'success' && (
          <Space
            direction="vertical"
            style={{
              width: '100%',
              marginBottom: '10px'
            }}
          >
            <Alert message="Done" type="success" showIcon />
          </Space>
        ))}

      {raisonStore.postRaison === 'rejected' && (
        <Space
          direction="vertical"
          style={{
            width: '100%',
            marginBottom: '10px'
          }}
        >
          <Alert message={raisonStore.postRaisonError} type="error" showIcon />
        </Space>
      )}
      {raisonStore.updateRaison === 'rejected' && (
        <Space
          direction="vertical"
          style={{
            width: '100%',
            marginBottom: '10px'
          }}
        >
          <Alert message={raisonStore.updateRaisonError} type="error" showIcon />
        </Space>
      )}
      <TextField fullWidth placeholder="Raison" value={raison} onChange={(e) => setRaison(e.target.value)} />

      <Button
        fullWidth
        onClick={raisonUpdate ? (e) => update(e) : (e) => addRaisons(e)}
        variant="contained"
        color="primary"
        sx={{ marginTop: '10px' }}
      >
        {raisonUpdate ? 'Modifier' : 'Enregistrer'}
      </Button>
    </div>
  );
}

export default FormRaison;
