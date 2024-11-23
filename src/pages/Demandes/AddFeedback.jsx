import { Button } from '@mui/material';
import { Input, message } from 'antd';
import axios from 'axios';
import React from 'react';
import { config, lien } from 'static/Lien';
const { TextArea } = Input;

function AddFeedback() {
  const [feedback, setFeedback] = React.useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    navigator.clipboard.writeText(texte);
    messageApi.open({
      type: '' + type,
      content: '' + texte,
      duration: 2
    });
  };
  const sendData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(lien + '/setFeedback', { title: feedback }, config);
      if (response.status !== 200) {
        success('' + response.data, 'error');
      } else {
        success('Opération effectuée', 'success');
      }
    } catch (error) {
      console.log(error);
      success('Error ' + error, 'error');
    }
  };
  return (
    <div style={{ minWidth: '20rem', padding: '5px' }}>
      {contextHolder}
      <div>
        <TextArea
          required
          value={feedback}
          onChange={(e) => {
            setFeedback(e.target.value);
          }}
          placeholder="Enter new feedback"
          autoSize={{
            minRows: 3,
            maxRows: 5
          }}
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <Button onClick={(e) => sendData(e)} color="primary" variant="contained" fullWidth>
          Add
        </Button>
      </div>
    </div>
  );
}

export default AddFeedback;
