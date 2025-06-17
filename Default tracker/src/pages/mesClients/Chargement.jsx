import { Skeleton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function Chargement() {
  const columns = [
    {
      field: 'codeclient',
      headerName: 'Code client',
      width: 120,
      pinned: 'left',
      renderCell: () => {
        return <Skeleton variant="text" sx={{ width: '100%' }} />;
      }
    },
    {
      field: 'nomclient',
      headerName: 'customer name',
      width: 120,
      editable: false,
      renderCell: () => {
        return <Skeleton variant="text" sx={{ width: '100%' }} />;
      }
    },
    {
      field: 'shop',
      headerName: 'Shop',
      width: 100,
      editable: false,
      renderCell: () => {
        return <Skeleton variant="text" sx={{ width: '100%' }} />;
      }
    },

    {
      field: 'par',
      headerName: 'PAR',
      width: 80,
      editable: false,
      renderCell: () => {
        return <Skeleton variant="text" sx={{ width: '100%' }} />;
      }
    },

    {
      field: 'last_vm_agent',
      headerName: 'Last VM Agent or Tech',
      width: 280,
      editable: false,

      renderCell: () => {
        return <Skeleton variant="text" sx={{ width: '100%' }} />;
      }
    },
    {
      field: 'last_vm_po',
      headerName: 'VM_PO',
      width: 280,
      editable: false,

      renderCell: () => {
        return <Skeleton variant="text" sx={{ width: '100%' }} />;
      }
    },
    {
      field: 'last_vm_rs',
      headerName: 'VM_RS',
      width: 280,
      editable: false,
      renderCell: () => {
        return <Skeleton variant="text" sx={{ width: '100%' }} />;
      }
    }
  ];
  return (
    <div>
      <DataGrid
        rows={Array.from({ length: 10 }, (_, index) => ({
          id: index // Ajuster l'ID pour le rendre unique
        }))}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 50
            }
          }
        }}
        pageSizeOptions={[50]}
        disableRowSelectionOnClick
      />
    </div>
  );
}

export default Chargement;
