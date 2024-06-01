/* eslint-disable react/prop-types */
import React from 'react';
import { TextField, Button } from '@mui/material';
import { AddRaison, updateRaison } from 'Redux/Raison';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Space } from 'antd';
import Selected from 'static/Select';

function FormRaison({ raisonUpdate, id, type }) {
  const [raison, setRaison] = React.useState('');
  const user = useSelector((state) => state.user);
  const raisonStore = useSelector((state) => state.raison);
  const dispatch = useDispatch();

  const [selectType, setSelectType] = React.useState('');

  const types = [
    { id: 1, title: 'Technique', value: 'technique' },
    { id: 2, title: 'Non technique', value: 'nonTechnique' }
  ];
  const addRaisons = (e) => {
    e.preventDefault();
    try {
      if ((user && user.readUser === 'rejected') || user?.user.length < 1) {
        localStorage.removeItem('auth');
        window.location.replace('/login');
      } else {
        dispatch(AddRaison({ raison, type: selectType, codeAgent: user.user.codeAgent }));
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
      setSelectType(type);
    }
  }, [id, raisonUpdate, type]);

  return (
    <div style={{ width: '20rem' }}>
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
      <div style={{ margin: '10px 0px' }}>
        <Selected label="Type" data={types} value={selectType} setValue={setSelectType} />
      </div>

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
