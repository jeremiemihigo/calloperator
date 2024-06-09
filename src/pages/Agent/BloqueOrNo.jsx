import { Button } from '@mui/material';
import { Input, message } from 'antd';
import axios from 'axios';
import React from 'react';
import { config, lien } from 'static/Lien';
import Selected from 'static/Select';
import * as xlsx from 'xlsx';

function BloqueOrNo() {
  const [value, setValue] = React.useState('');
  const [donner, setDonner] = React.useState();
  const data = [
    { id: 1, title: 'Inactive', value: false },
    { id: 1, title: 'Active', value: true }
  ];
  const [sending, setSending] = React.useState(true);
  const readUploadFile = (e) => {
    e.preventDefault();
    setSending(true);
    try {
      if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = xlsx.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = xlsx.utils.sheet_to_json(worksheet);
          setDonner(json);
          setSending(false);
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      }
    } catch (error) {
      alert('Error ' + error);
    }
  };
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: '' + texte,
      duration: 3
    });
  };
  const send = async (e) => {
    e.preventDefault();
    let id = [];
    for (let i = 0; i < donner.length; i++) {
      id.push(donner[i]['ID']);
    }
    const response = await axios.put(lien + '/bloquerOrNo', { liste: id, action: value }, config);
    success('' + response.data, 'success');
  };
  return (
    <div style={{ minWidth: '20rem' }}>
      {contextHolder}
      <div style={{ marginTop: '10px' }}>
        <Selected label="Action" data={data} value={value} setValue={setValue} />
      </div>
      <div style={{ marginTop: '10px' }}>
        <Input placeholder="Importez le fichier" type="file" onChange={(e) => readUploadFile(e)} />
      </div>
      <div style={{ marginTop: '10px' }}>
        <Button onClick={(e) => send(e)} variant="contained" color="primary" fullWidth disabled={sending}>
          Send
        </Button>
      </div>
    </div>
  );
}

export default BloqueOrNo;
