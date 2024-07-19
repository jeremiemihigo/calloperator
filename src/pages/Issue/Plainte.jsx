import { Add } from '@mui/icons-material';
import { Fab } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import { useSelector } from 'react-redux';
import Popup from 'static/Popup';
import ItemPlain from './AddItemPlainte';
import AddPlainte from './AddPlainte';

function Plainte() {
  const [open, setOpen] = React.useState(false);
  const [openItem, setOpenItem] = React.useState(false);
  const plainte = useSelector((state) => state.plainte.plainte);
  const [plainteSelect, setPlainteSelect] = React.useState('');

  const addItem = (params) => {
    setPlainteSelect(params);
    setOpenItem(true);
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
      editable: false
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 100,
      editable: false
    },
    {
      field: 'items',
      headerName: 'Items',
      width: 750,
      renderCell: (params) => {
        return (
          <>
            {params.row?.alltype.length > 0 &&
              params.row.alltype.map((index) => {
                return (
                  <p style={{ padding: '0px', margin: '0px', width: '100%' }} key={index._id}>
                    {index.title}
                  </p>
                );
              })}
          </>
        );
      }
    },
    {
      field: 'option',
      headerName: 'Option',
      width: 100,
      editable: false,
      renderCell: (params) => {
        return (
          <Fab size="small" onClick={() => addItem(params.row.id)}>
            <Add fontSize="small" />
          </Fab>
        );
      }
    }
  ];

  return (
    <div>
      <Fab size="small" onClick={() => setOpen(true)}>
        <Add fontSize="small" />
      </Fab>

      <div>
        {plainte && plainte.length > 0 ? (
          <DataGrid
            rows={plainte}
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
        ) : (
          <p className="red">Aucun technicien trouvé</p>
        )}
      </div>

      <Popup open={open} setOpen={setOpen} title="Plainte">
        <AddPlainte />
      </Popup>
      <Popup open={openItem} setOpen={setOpenItem} title="Add Items">
        <ItemPlain item={plainteSelect} />
      </Popup>
    </div>
  );
}

export default Plainte;
