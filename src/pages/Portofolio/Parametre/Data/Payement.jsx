import { Delete } from "@mui/icons-material";
import { CircularProgress, Grid, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import SimpleBackdrop from "Control/Backdrop";
import DirectionSnackbar from "Control/SnackBar";
import moment from "moment";
import React from "react";
import { config, portofolio } from "static/Lien";

function PayementUpload() {
  const [data, setData] = React.useState();
  const [load, setLoad] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const loading = async () => {
    try {
      setLoad(true);
      const response = await axios.get(`${portofolio}/uploadpayment`, config);
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
      setSending(true);
      setMessage("");
      const response = await axios.delete(
        `${portofolio}/deletepayment/${id}`,
        config
      );
      if (response.status === 200) {
        setData(data.filter((x) => x.id !== response.data.id));
        setSending(false);
      } else {
        setMessage("" + response.data);
        setSending(false);
      }
    } catch (error) {
      setSending(false);
      setMessage(error.message);
    }
  };

  const columns = [
    {
      field: "account_id",
      headerName: "customer_id",
      width: 120,
      editable: false,
    },
    {
      field: "shop_name",
      headerName: "shop_name",
      width: 180,
      editable: false,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 100,
      editable: false,
    },
    {
      field: "Statut",
      headerName: "Statut",
      width: 80,
      editable: false,
      renderCell: (params) => {
        return params.row.considerer ? (
          <p style={{ ...style.label, background: "green" }}>Valide</p>
        ) : (
          <p style={{ ...style.label, background: "yellow" }}>Pending</p>
        );
      },
    },
    {
      field: "Date",
      headerName: "Upload date",
      width: 140,
      editable: false,
      renderCell: (params) => {
        return `${moment(params.row.createdAt).format("dddd DD-MM-YYYY")}`;
      },
    },

    {
      field: "Edit",
      headerName: "Delete",
      width: 50,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            <Delete
              fontSize="small"
              sx={{ cursor: "pointer" }}
              onClick={() => deleteupload(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{ marginTop: "10px", display: "flex", justifyContent: "center" }}
    >
      <SimpleBackdrop open={sending} taille="10rem" title="Please wait..." />
      {message && <DirectionSnackbar message={message} />}
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
        <Grid container>
          <Grid item lg={2}></Grid>
          <Grid item lg={8}>
            <DataGrid
              rows={data}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 20,
                  },
                },
              }}
              pageSizeOptions={[20]}
              disableRowSelectionOnClick
            />
          </Grid>
          <Grid item lg={2}></Grid>
        </Grid>
      )}
    </Paper>
  );
}
const style = {
  label: {
    padding: "5px",
    borderRadius: "2px",
    margin: "0px",
    fontWeight: 500,
    width: "100%",
    textAlign: "center",
  },
};
export default PayementUpload;
