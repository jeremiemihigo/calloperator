/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Grid, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import _ from 'lodash';
import React from 'react';
import { dateFrancais } from 'static/Lien';

function Plaintes({ data, dates }) {
  const [result, setResult] = React.useState();
  const loading = () => {
    let table = [];
    let objects = _.toArray(Object.keys(_.countBy(data, 'demande.raison')));

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
      </Grid>
      {result && (
        <DataGrid
          rows={result}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 6
              }
            }
          }}
          pageSizeOptions={[6]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      )}
    </div>
  );
}

export default Plaintes;
