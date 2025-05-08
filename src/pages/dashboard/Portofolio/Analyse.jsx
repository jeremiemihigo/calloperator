import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tronquerDecimales } from "static/Lien";

function Analyse({ data }) {
  const columns = [
    {
      field: "agent",
      headerName: "Name",
      width: 250,
      editable: false,
    },
    {
      field: "nbre_appel",
      headerName: "Calls",
      width: 70,
      editable: false,
    },
    {
      field: "non_action",
      headerName: "Non_action",
      width: 80,
      editable: false,
    },
    {
      field: "action",
      headerName: "Action",
      width: 70,
      editable: false,
    },
    {
      field: "cash",
      headerName: "Cash",
      width: 100,
      editable: false,
      renderCell: (params) => {
        return `$${tronquerDecimales(params.row.cash)}`;
      },
    },
    {
      field: "pourcentage",
      headerName: "Percent",
      width: 80,
      editable: false,
    },
  ];
  return (
    <Paper elevation={2}>
      {data && data.length > 0 ? (
        <DataGrid
          rows={data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 7,
              },
            },
          }}
          pageSizeOptions={[7]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      ) : (
        <p className="red">No data found</p>
      )}
    </Paper>
  );
}

export default Analyse;
