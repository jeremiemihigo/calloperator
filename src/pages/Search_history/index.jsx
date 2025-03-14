import { SearchOutlined } from '@ant-design/icons';
import { FormControl, Grid, InputAdornment, OutlinedInput, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import moment from 'moment';
import React from 'react';
import ExcelButton from 'static/ExcelButton';
import { config, lien } from 'static/Lien';
import './search.style.css';

function Index() {
  const [data, setData] = React.useState();
  const [load, setLoading] = React.useState(false);
  const loading = async () => {
    try {
      setLoading(true);
      const response = await axios.get(lien + '/get_corbeille', config);
      if (response.status === 200) {
        setData(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, []);
  const increment_hours = (d) => {
    const date = new Date(d);
    // const new_hours = date.getHours() + nombre;
    // date.setHours(new_hours);
    return `${date.getHours()}h${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
  };

  const [filterFn, setFilterFn] = React.useState({
    fn: (items) => {
      return items;
    }
  });
  const handleChanges = (e) => {
    let target = e.target.value;

    setFilterFn({
      fn: (items) => {
        if (target === '') {
          return items;
        } else {
          return items.filter((x) => x.name.toUpperCase().includes(target.toUpperCase()));
        }
      }
    });
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      editable: false
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 100,
      editable: false,
      renderCell: (params) => {
        return moment(params.row.createdAt).format('DD-MM-YYYY');
      }
    },
    {
      field: 'heure',
      headerName: 'Time',
      width: 100,
      editable: false,
      renderCell: (params) => {
        return increment_hours(params.row?.createdAt);
      }
    },
    {
      field: 'texte',
      headerName: 'what_he_did',
      width: 600,
      editable: false
    }
  ];

  function getRowId(row) {
    return row._id;
  }

  return (
    <>
      {load && <p style={{ textAlign: 'center', color: 'blue' }}>Loading...</p>}
      <Paper elevation={1} style={{ marginBottom: '10px', padding: '5px' }}>
        <Grid container>
          <Grid item lg={6}>
            {' '}
            <FormControl sx={{ width: '100%' }}>
              <OutlinedInput
                size="small"
                id="header-search"
                startAdornment={
                  <InputAdornment position="start" sx={{ mr: -0.5 }}>
                    <SearchOutlined />
                  </InputAdornment>
                }
                aria-describedby="header-search-text"
                inputProps={{
                  'aria-label': 'weight'
                }}
                onChange={(e) => handleChanges(e)}
                placeholder="Search name"
              />
            </FormControl>
          </Grid>
          <Grid item lg={2} sx={{ paddingLeft: '5px' }}>
            {data && <ExcelButton data={data} title="Excel" fileName="Search_history.xlsx" />}
          </Grid>
        </Grid>
      </Paper>
      <Grid container>
        <div className="col-lg-12">
          {data && data.length > 0 && (
            <DataGrid
              rows={filterFn.fn(data)}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 50
                  }
                }
              }}
              getRowId={getRowId}
              pageSizeOptions={[50]}
              checkboxSelection
              disableRowSelectionOnClick
            />
          )}
        </div>
      </Grid>
    </>
  );
}

export default Index;
