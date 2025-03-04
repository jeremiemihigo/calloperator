import { Skeleton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function Chargement() {
  const columnsFech = [
    {
      field: 'codeclient',
      headerName: 'Code client',
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
      field: 'visitedBy',
      headerName: 'Visited_by',
      width: 100,
      editable: false,
      renderCell: () => {
        return <Skeleton variant="text" sx={{ width: '100%' }} />;
      }
    },
    {
      field: 'last_vm',
      headerName: 'Last Feedback_VM',
      width: 220,
      editable: false,
      renderCell: () => {
        return <Skeleton variant="text" sx={{ width: '100%' }} />;
      }
    },
    {
      field: 'feedback_call',
      headerName: 'Feedback_appel',
      width: 250,
      editable: false,
      renderCell: () => {
        return <Skeleton variant="text" sx={{ width: '100%' }} />;
      }
    },
    {
      field: 'currentFeedback',
      headerName: 'Current status',
      width: 200,
      editable: false,
      renderCell: () => {
        return <Skeleton variant="text" sx={{ width: '100%' }} />;
      }
    },
    {
      field: 'sla',
      headerName: 'SLA',
      width: 70,
      editable: false,
      renderCell: () => {
        return <Skeleton variant="text" sx={{ width: '100%' }} />;
      }
    },
    {
      field: 'change',
      headerName: 'Change',
      width: 150,
      editable: false,
      renderCell: () => {
        return <Skeleton variant="text" sx={{ width: '100%' }} />;
      }
    }
  ];
  const dataFect = [
    {
      codeclient: '23',
      currentFeedback: 'currentFeedback',
      feedback_call: 'feedback_call',
      last_vm: 'last_vm',
      shop: 'Goma',
      par: 'PAR 30',
      visitedBy: 'DRC',
      sla: 'sla',
      change: 'change'
    }
  ];
  return (
    <div>
      <DataGrid
        rows={Array.from({ length: 10 }, (_, index) => ({
          ...dataFect,
          id: dataFect.id + index // Ajuster l'ID pour le rendre unique
        }))}
        columns={columnsFech}
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
