import React from 'react';
import * as xlsx from 'xlsx';
import { Alert, Button, Grid, CircularProgress, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { lien, config } from 'static/Lien';
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Input } from 'antd';
// import DirectionSnackbar from "../static/SnackBar";

function Parametre() {
  const [excelData, setExcelData] = React.useState();
  const [excelFileError, setExcelFileError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [deleting, setDelete] = React.useState(false);
  // const [openSnack, setOpenSnack] = React.useState(false);
  // const [messageSnack, setmessageSnack] = React.useState("");

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

  const columns = [
    {
      field: 'customer',
      headerName: 'Customer',
      width: 180,
      editable: false
    },

    {
      field: 'customer_cu',
      headerName: 'CUSTOMER CU',
      width: 200,
      editable: false
    },
    {
      field: 'nomClient',
      headerName: 'Nom du client',
      width: 250,
      editable: false
    },
    {
      field: 'region',
      headerName: 'Region',
      width: 150,
      editable: false
    },
    {
      field: 'shop',
      headerName: 'SHOP',
      width: 200,
      editable: false
    }
  ];

  const dataParams = useSelector((state) => state.parametre);

  const sendData = async () => {
    setLoading(true);
    let dataSend = [];

    let nombre = 0;
    try {
      for (let i = 0; i < excelData.length; i++) {
        nombre = nombre + 1;
        dataSend.push(excelData[i]);
        if (nombre == 100) {
          const response = await axios.post(lien + '/paramatre', {
            data: dataSend
          });
          console.log(response);
          nombre = 0;
          dataSend = [];
        }
        if (i === excelData.length - 1) {
          const response = await axios.post(lien + '/paramatre', {
            data: dataSend
          });
          console.log(response);
        }
      }
      // window.location.replace('/parametre');
    } catch (error) {
      setLoading(false);
      setExcelFileError(error);
    }
  };
  const DeleteAll = () => {
    setDelete(true);
    axios
      .delete(lien + '/deleteParams', config)
      .then((response) => {
        if (response) {
          window.location.replace('/bboxx/parametre');
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  return (
    <div>
      {/* {openSnack && (
        <DirectionSnackbar
          message={messageSnack}
          open={openSnack}
          setOpen={setOpenSnack}
        />
      )} */}

      <form className="form-group" autoComplete="off">
        {excelFileError && (
          <div className="mb-4">
            <Alert severity="warning" variant="standard">
              {excelFileError && excelFileError}
            </Alert>
          </div>
        )}
        <Grid container>
          <Grid item lg={6}>
            <form>
              <Input type="file" name="upload" id="upload" onChange={readUploadFile} />
            </form>
          </Grid>
          <Grid item lg={3}>
            <Button disabled={loading} color="primary" variant="contained" onClick={() => sendData()} sx={{ marginLeft: '10px' }}>
              {loading && <CircularProgress size={15} sx={{ marginRight: '15px' }} color="inherit" />}{' '}
              {!loading && <SendIcon fontSize="small" />} {loading ? 'Sending...' : 'Envoyer'}
            </Button>
            <Button disabled={deleting} onClick={() => DeleteAll()} color="warning" variant="contained" sx={{ marginLeft: '10px' }}>
              <DeleteIcon fontSize="small" /> Delete all
            </Button>
          </Grid>
        </Grid>
        <Grid sx={{ marginTop: '12px' }}>
          <Paper>
            {dataParams.getParametre === 'pending' && <p style={{ textAlign: 'center', color: 'blue', fontSize: '14px' }}>Loading...</p>}
            {dataParams.parametre && dataParams.getParametre !== 'pending' && (
              <DataGrid
                rows={dataParams.parametre}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 7
                    }
                  }
                }}
                pageSizeOptions={[7]}
                checkboxSelection
                disableRowSelectionOnClick
              />
            )}
          </Paper>
        </Grid>
      </form>
    </div>
  );
}

export default Parametre;
