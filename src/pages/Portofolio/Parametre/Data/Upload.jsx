import { Delete, Edit } from "@mui/icons-material";
import { CircularProgress, Fab, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React from "react";
import { config, portofolio } from "static/Lien";
import Popup from "static/Popup";
import EditUpload from "./EditUpload";

function UploadData() {
  const [data, setData] = React.useState();
  const [load, setLoad] = React.useState(false);
  const loading = async () => {
    try {
      setLoad(true);
      const response = await axios.get(`${portofolio}/dataupload`, config);
      if (response.status === 200) {
        setData(response.data);
        setLoad(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  React.useEffect(() => {
    loading();
  }, []);
  const deleteupload = async (id) => {
    try {
      const response = await axios.delete(
        `${portofolio}/deleteupload/${id}`,
        config
      );
      if (response.status === 200) {
        setData(data.filter((x) => x.id !== response.data._id));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [open, setOpen] = React.useState(false);
  const [dataedit, setDataEdit] = React.useState();
  const editFunctinon = (d) => {
    setDataEdit(d);
    setOpen(true);
  };
  const columns = [
    {
      field: "codeclient",
      headerName: "customer_id",
      width: 120,
      editable: false,
    },
    {
      field: "customer_name",
      headerName: "Customer_name",
      width: 180,
      editable: false,
    },
    {
      field: "etat",
      headerName: "Call",
      width: 100,
      editable: false,
    },
    {
      field: "par",
      headerName: "Par",
      width: 80,
      editable: false,
    },

    {
      field: "shop",
      headerName: "Shop",
      width: 120,
      editable: false,
    },
    {
      field: "status",
      headerName: "Statut",
      width: 90,
      editable: false,
    },
    {
      field: "Payment",
      headerName: "Payment",
      width: 120,
      editable: false,
      renderCell: (params) => {
        return `$${params.row.dailyrate}; $${params.row.weeklyrate}; $${params.row.monthlyrate}`;
      },
    },
    {
      field: "number",
      headerName: "Contact",
      width: 150,
      editable: false,
      renderCell: (params) => {
        return `${params.row.first_number}; ${params.row.second_number}; ${params.row.payment_number}`;
      },
    },
    {
      field: "Edit",
      headerName: "Edit",
      width: 105,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            <Fab
              onClick={() => editFunctinon(params.row)}
              sx={{ marginRight: "5px" }}
              size="small"
              color="primary"
            >
              <Edit fontSize="small" />
            </Fab>
            <Fab
              size="small"
              color="error"
              onClick={() => deleteupload(params.row.id)}
            >
              <Delete fontSize="small" />
            </Fab>
          </>
        );
      },
    },
  ];

  return (
    <Paper elevation={0} sx={{ marginTop: "10px" }}>
      {load && (
        <div
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={15} color="primary" />
          <p
            style={{
              fontSize: "12px",
              marginTop: "15px",
              padding: "0px",
              margin: "0px 5px",
            }}
          >
            Loading...
          </p>
        </div>
      )}
      {data && !load && data.length > 0 && (
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
          disableRowSelectionOnClick
        />
      )}
      {dataedit && (
        <Popup open={open} setOpen={setOpen} title="Edit">
          <EditUpload data={dataedit} />
        </Popup>
      )}
    </Paper>
  );
}

export default UploadData;
