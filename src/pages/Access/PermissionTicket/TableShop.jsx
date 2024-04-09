import React from 'react';
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { Edit } from '@mui/icons-material';
import { Fab } from '@mui/material';
import AddAcces from './AddAcces';
import Popup from 'static/Popup';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import TagFacesIcon from '@mui/icons-material/TagFaces';

function TableShop() {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState();
  const openFunction = (donner) => {
    setData(donner);
    setOpen(true);
  };
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      editable: false,
      renderCell: (params) => {
        return dayjs(params.row.id).format('DD/MM/YYYY');
      }
    },
    {
      field: 'shop',
      headerName: 'Shop',
      width: 150,
      editable: false
    },
    {
      field: 'Autorisation',
      headerName: 'Autorisation',
      width: 650,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            {params.row?.ticket.map((index) => {
              return (
                <Stack direction="row" spacing={1} key={index._id} sx={{ marginRight: '5px' }}>
                  <Chip
                    icon={<TagFacesIcon />}
                    avatar={<Avatar alt={index.nom} src="/static/images/avatar/1.jpg" />}
                    label={index.nom}
                    variant="outlined"
                  />
                </Stack>
              );
            })}
          </>
        );
      }
    },
    {
      field: 'Action',
      headerName: 'Action',
      width: 50,
      editable: false,
      renderCell: (params) => {
        return (
          <Fab size="small" color="primary" onClick={() => openFunction(params.row)}>
            <Edit fontSize="small" />
          </Fab>
        );
      }
    }
  ];
  const shop = useSelector((state) => state.shop);

  return (
    <div>
      {shop?.shop && (
        <DataGrid
          columns={columns}
          rows={shop?.shop}
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
      {data && (
        <Popup open={open} setOpen={setOpen} title="Permission">
          <AddAcces data={data} />
        </Popup>
      )}
    </div>
  );
}

export default TableShop;
