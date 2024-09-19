import { Edit } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import { CreateContexteGlobal } from 'GlobalContext';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_issue } from 'static/Lien';

function WhyEdit({ row }) {
  const [value, setValue] = React.useState('');
  const user = useSelector((state) => state.user?.user);
  const { client, setClient } = React.useContext(CreateContexteGlobal);
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: '' + texte,
      duration: 10
    });
  };

  const changeStatus = async (e) => {
    e.preventDefault();
    try {
      if (user.nom !== row.submitedBy) {
        success(`seulement ${row.submitedBy} peut effectuer cette operation`, 'error');
      } else {
        const { _id } = row;
        const response = await axios.post(
          lien_issue + '/updateappel',
          { data: { id: _id, data: { operation: 'backoffice', open: true, editRaison: value, statut: 'To_Modify' } } },
          config
        );
        if (response.status === 200) {
          success('Done', 'success');
          setClient(client.map((x) => (x._id === response.data._id ? response.data : x)));
        }
        if (response.status === 201) {
          success('' + response.data, 'error');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div style={{ width: '20rem' }}>
      {contextHolder}
      <div style={{ margin: '10px 0px' }}>
        <TextField value={value} onChange={(e) => setValue(e.target.value)} name="raison" autoComplete="off" fullWidth label="Raison" />
      </div>
      <div>
        <Button onClick={(e) => changeStatus(e)} variant="contained" color="primary" fullWidth>
          <Edit fontSize="small" /> <span style={{ marginLeft: '10px' }}>Escalade</span>
        </Button>
      </div>
    </div>
  );
}

export default WhyEdit;
