import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import NoCustomer from "components/Attente";
import LoadingImage from "Control/Loading";
import moment from "moment";
import React from "react";
import ExcelButton from "static/ExcelButton";
import { config, lien_issue } from "static/Lien";
import { Paper, Typography } from "../../../node_modules/@mui/material/index";

function Renseignement() {
  const [data, setData] = React.useState();
  const [load, setLoad] = React.useState(false);
  const loading = async () => {
    try {
      setLoad(true);
      const response = await axios.get(lien_issue + "/r_renseignement", config);
      setData(JSON.parse(response.data));
      setLoad(false);
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, []);

  const columns = [
    {
      field: "nomClient",
      headerName: "customer_name",
      width: 100,
      editable: false,
    },
    {
      field: "contact",
      headerName: "contact",
      width: 100,
      editable: false,
    },
    {
      field: "about",
      headerName: "Information_about",
      width: 300,
      editable: false,
    },
    {
      field: "origin",
      headerName: "origin",
      width: 120,
      editable: false,
    },
    {
      field: "date",
      headerName: "date",
      width: 100,
      editable: false,
      renderCell: (p) => {
        return moment(p.row.date).format("DD-MM-YYYY");
      },
    },
    {
      field: "savedBy",
      headerName: "savedBy",
      width: 130,
      editable: false,
    },
  ];

  return (
    <div>
      <Paper
        sx={{
          padding: "10px",
          marginBottom: "10px",
          alignItems: "center",
          justifyContent: "space-between",
          display: "flex",
        }}
      >
        <Typography sx={{ textAlign: "center" }}>
          All inquiries recorded at the shop and call center
        </Typography>
        {data && data.length > 0 && (
          <div style={{ width: "20%" }}>
            <ExcelButton
              data={data}
              title="Export in Excel"
              fileName="Toutes_les_renseignements.xlsx"
            />
          </div>
        )}
      </Paper>
      {load && <LoadingImage />}
      {!load && data && data.length === 0 && (
        <NoCustomer texte="No information found" />
      )}
      {data && data.length > 0 && (
        <Paper elevation={2}>
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
            getRowId={(row) => row._id}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Paper>
      )}
    </div>
  );
}

export default Renseignement;
