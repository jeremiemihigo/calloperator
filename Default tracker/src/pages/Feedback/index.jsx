import { Add, Edit } from '@mui/icons-material';
import { Fab, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ChangeByExcel from 'components/ChangeByExcel';
import LoaderGif from 'components/LoaderGif';
import React from 'react';
import { useSelector } from 'react-redux';
import Popup from 'static/Popup';
import { returnRole } from 'utils/function';
import * as XLSX from 'xlsx';
import Formulaire from './Formulaire';

function Index() {
  const [open, setOpen] = React.useState(false);
  const roles = useSelector((state) => state.role.role);
  const feedback = useSelector((state) => state.feedback.feedback);
  const [dataedit, setDataedit] = React.useState();
  const [openedit, setOpenedit] = React.useState(false);
  const [data, setData] = React.useState();

  const editFeedback = (d) => {
    setDataedit(d);
    setOpenedit(true);
  };
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
      editable: false
    },
    {
      field: 'statut',
      headerName: 'Statut',
      width: 350,
      editable: false
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 70,
      editable: false
    },
    {
      field: 'departement',
      headerName: 'Département_en_charge',
      width: 300,
      editable: false
    },
    {
      field: 'options',
      headerName: 'Edit',
      width: 60,
      editable: false,
      renderCell: (p) => {
        return (
          <Fab color="primary" size="small" onClick={() => editFeedback(p.row)}>
            <Edit fontSize="small" />
          </Fab>
        );
      }
    }
  ];

  const returnRoleMyrole = (ro) => {
    let r = ro.map((x) => returnRole(roles, x));
    return r.join(';');
  };
  React.useEffect(() => {
    if (feedback) {
      let d = feedback.map(function (x) {
        return {
          id: x._id,
          statut: x.title,
          departement: returnRoleMyrole(x.idRole),
          nombre: x.idRole.length,
          delai: x.delai,
          idRole: x.idRole
        };
      });
      setData(d);
    }
  }, [feedback]);
  const StructureDataExcel = (e) => {
    e.preventDefault();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DT');
    XLSX.writeFile(workbook, `status.xlsx`);
  };
  return (
    <>
      <Paper elevation={3} sx={{ padding: '10px', display: 'flex', alignItems: 'center' }}>
        <Fab onClick={() => setOpen(true)} size="small" color="primary">
          <Add fontSize="small" />
        </Fab>
        <ChangeByExcel texte="Export in Excel" onClick={(e) => StructureDataExcel(e)} />
      </Paper>
      <Paper elevation={3} sx={{ padding: '10px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!feedback && <LoaderGif width={400} height={400} />}
        {data && data.length > 0 && (
          <div>
            <DataGrid
              rows={data}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10
                  }
                }
              }}
              pageSizeOptions={[10]}
              checkboxSelection
              disableRowSelectionOnClick
            />
          </div>
        )}
      </Paper>
      <Popup open={open} setOpen={setOpen} title="Add feedback">
        <Formulaire />
      </Popup>
      {dataedit && (
        <Popup open={openedit} setOpen={setOpenedit} title="Edit feedback">
          <Formulaire data={dataedit} />
        </Popup>
      )}
    </>
  );
}

export default Index;
