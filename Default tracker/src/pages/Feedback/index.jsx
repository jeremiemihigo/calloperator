import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import LoaderGif from 'components/LoaderGif';
import { useSelector } from 'react-redux';

function Index() {
  const feedback = useSelector((state) => state.feedback.feedback);
  const columns = [
    {
      field: 'idFeedback',
      headerName: 'ID',
      width: 50,
      editable: false
    },
    {
      field: 'title',
      headerName: 'Statut',
      width: 450,
      editable: false
    },
    {
      field: 'departement',
      headerName: 'Département_en_charge',
      width: 300,
      editable: false,
      renderCell: (p) => {
        return <>{p.row.role && p.row?.role.map((index) => index.title + '; ')}</>;
      }
    }
  ];
  const returnID = (row) => {
    return row._id;
  };

  return (
    <>
      <Paper elevation={3} sx={{ padding: '10px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!feedback && <LoaderGif width={400} height={400} />}
        {feedback && feedback.length > 0 && (
          <div>
            <DataGrid
              rows={feedback}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 30
                  }
                }
              }}
              getRowId={returnID}
              pageSizeOptions={[30]}
              disableRowSelectionOnClick
            />
          </div>
        )}
      </Paper>
    </>
  );
}

export default Index;
