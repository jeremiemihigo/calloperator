/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import { DataGrid } from '@mui/x-data-grid';
import Ajustage from './Ajustage';
import Popup from 'static/Popup';
import { Grid, Typography } from '@mui/material';
import { dateFrancais } from 'static/Lien';

function Plaintes({ data, loadings, dates }) {
  const [result, setResult] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [objects, setObjects] = React.useState();
  const loading = () => {
    let table = [];
    let objects = _.toArray(Object.keys(_.countBy(data, 'demande.raison')));
    setObjects(objects);
    for (let i = 0; i < objects.length; i++) {
      table.push({
        title: objects[i],
        nombre: data.filter((x) => x.demande.raison === objects[i]).length,
        id: i
      });
    }
    setResult(_.orderBy(table, 'nombre', 'desc'));
  };
  React.useEffect(() => {
    loading();
  }, [data]);
  const columns = [
    {
      field: 'title',
      headerName: 'Raison',
      width: 250,
      editable: false
    },

    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 50,
      editable: false
    }
  ];
  return (
    <div>
      <Grid className="pagesTitle">
        <Typography component="span">
          Les plaintes du {dateFrancais(dates.debut)} au {dateFrancais(dates.fin)}
        </Typography>
        <Typography component="span" onClick={() => setOpen(true)} style={{ marginLeft: '10px', color: 'red', cursor: 'pointer' }}>
          Ajuster
        </Typography>
      </Grid>
      {result && (
        <DataGrid
          rows={result}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5
              }
            }
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      )}
      {objects && (
        <Popup open={open} setOpen={setOpen} title="Ajustage">
          <Ajustage feedback={objects} loading={loadings} />
        </Popup>
      )}
    </div>
  );
}

export default Plaintes;
