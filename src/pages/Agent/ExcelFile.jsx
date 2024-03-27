import React from 'react';
import * as xlsx from 'xlsx';
import { Grid, CircularProgress } from '@mui/material';
import { Input, Button } from 'antd';
import { lien, config } from 'static/Lien';
import axios from 'axios';

function ExcelFile() {
  const [loading, setLoading] = React.useState(false);
  const [excelData, setExcelData] = React.useState();

  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        setExcelData(json);
        setLoading(false);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const sendData = async () => {
    setLoading(true);
    let dataSend = [];

    let nombre = 0;
    try {
      for (let i = 0; i < excelData.length; i++) {
        nombre = nombre + 1;
        dataSend.push(excelData[i]);
        if (nombre == 100) {
          console.log(dataSend);
          const response = await axios.post(
            lien + '/manyAgent',
            {
              data: dataSend
            },
            config
          );
          console.log(response);
          nombre = 0;
          dataSend = [];
        }
        if (i === excelData.length - 1) {
          const response = await axios.post(
            lien + '/manyAgent',
            {
              data: dataSend
            },
            config
          );
          console.log(response);
        }
      }
      window.location.replace('/bboxx/agent');
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <div>
      <Grid container>
        <Grid item lg={9}>
          <form>
            <Input type="file" name="upload" id="upload" onChange={readUploadFile} />
          </form>
        </Grid>
        <Grid item lg={3}>
          <div style={{ marginLeft: '10px' }}>
            <Button disabled={loading} type="primary" onClick={() => sendData()}>
              {loading && <CircularProgress size={15} sx={{ marginRight: '15px' }} color="inherit" />} {loading ? 'Sending...' : 'Envoyer'}
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default ExcelFile;
