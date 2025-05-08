import { Edit } from "@mui/icons-material";
import { Fab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React from "react";
import { config, lien } from "static/Lien";

function Table() {
  const [data, setData] = React.useState([]);
  const loading = async () => {
    try {
      const response = await axios.get(lien + "/readfeedback/all", config);
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    loading();
  }, []);
  const openPopup = (row) => {
    console.log(row);
  };
  const columns = [
    { field: "id", headerName: "ID", width: 100, editable: false },
    { field: "title", headerName: "Feedback", width: 350, editable: false },
    {
      field: "feedbackdt",
      headerName: "Feedback Default tracker",
      width: 250,
      editable: false,
      renderCell: (params) => {
        return (
          <>{params.row.feeddt.length > 0 && params.row.feeddt[0].title}</>
        );
      },
    },
    {
      field: "plateforme",
      headerName: "Plateforme",
      width: 100,
      editable: false,
    },
    {
      field: "Options",
      headerName: "Edit",
      width: 150,
      editable: false,
      renderCell: (params) => {
        return (
          <Fab
            size="small"
            color="secondary"
            onClick={() => openPopup(params.row)}
          >
            <Edit fontSize="small" />
          </Fab>
        );
      },
    },
  ];
  return (
    <div>
      {data.length > 0 && (
        <DataGrid
          rows={data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 50,
              },
            },
          }}
          pageSizeOptions={[50]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      )}
    </div>
  );
}

export default Table;
