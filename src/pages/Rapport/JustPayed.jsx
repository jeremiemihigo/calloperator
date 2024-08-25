import { Grid, Typography } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import SimpleBackdrop from 'Control/Backdrop';
import React from 'react';
import { config, lien } from 'static/Lien';
import * as xlsx from 'xlsx';
import './style.css';

function JustPayed() {
  const [data, setData] = React.useState([]);
  const [sending, setSending] = React.useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: '' + texte,
      duration: 10
    });
  };
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
          setData(json);
          setSending(false);
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      }
    } catch (error) {
      alert('Error ' + error);
    }
  };
  const sendData = async (e) => {
    e.preventDefault();
    try {
      let table = [];
      for (let i = 0; i < data.length; i++) {
        table.push(data[i].id);
      }
      const response = await axios.post(lien + '/refresh_payment', { data: table }, config);
      if (response.status === 200) {
        success('Update of ' + response.data.matchedCount + ' customer', 'success');
      } else {
        success('' + response.data, 'error');
      }
    } catch (error) {
      success('' + error, 'error');
    }
  };
  return (
    <div>
      <>
        {contextHolder}
        {sending && <SimpleBackdrop open={true} title="Please wait..." taille="10rem" />}
        <Grid sx={{ paddingLeft: '10px' }}>
          <input type="file" id="actual-btn" accept=".xlsx" hidden onChange={(e) => readUploadFile(e)} />
          <label className="label" htmlFor="actual-btn">
            Clic here to choose file (you mast import only the customer id)
          </label>
        </Grid>
        {data.length > 0 && (
          <Typography sx={{ marginLeft: '15px', cursor: 'pointer', color: 'blue' }} onClick={(e) => sendData(e)}>
            Send data {data.length}
          </Typography>
        )}
      </>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <table style={{ width: '30%' }}>
          <thead>
            <tr>
              <td style={{ textAlign: 'center' }}>id</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: 'center' }}>BDRC00000000</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'center' }}>BDRC00000000</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'center' }}>BDRC00000000</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'center' }}>BDRC00000000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default JustPayed;
