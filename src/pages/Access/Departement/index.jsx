import { ViewAgenda } from "@mui/icons-material";
import { Fab, Grid, Tooltip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import React from "react";
import { config, lien_dt } from "static/Lien";
import Popup from "static/Popup";
import AddDepartement from "./AddDepartement";
import "./department.style.css";

function Departement() {
  const [data, setData] = React.useState();
  const [open, setOpen] = React.useState(false);
  const loadingRole = async () => {
    try {
      const response = await axios.get(lien_dt + "/role", config);
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loadingRole();
  }, []);
  const columns = [
    {
      field: "title",
      headerName: "Departement",
      width: 120,
      editable: false,
    },
    {
      field: "filterBy",
      headerName: "Filter By",
      width: 120,
      editable: false,
    },
    {
      field: "type",
      headerName: "Type",
      width: 80,
      editable: false,
    },
    {
      field: "updatedAt",
      headerName: "updatedAt",
      width: 130,
      editable: false,
      renderCell: (p) => {
        return <>{moment(p.row.updatedAt).format("YYYY-MM-DD hh:mm:ss")}</>;
      },
    },

    {
      field: "reset",
      headerName: "View",
      width: 70,
      editable: false,
      renderCell: () => {
        return (
          <>
            <Tooltip title="View post">
              <Fab color="primary" size="small">
                <ViewAgenda />
              </Fab>
            </Tooltip>
          </>
        );
      },
    },
  ];
  const getID = (row) => {
    return row._id;
  };
  return (
    <>
      <Grid container>
        <Grid item lg={6}>
          <Grid className="ajouter" onClick={() => setOpen(true)}>
            <Typography noWrap component="p">
              Add a department
            </Typography>
          </Grid>
          <div>
            {data && data.length > 0 && (
              <DataGrid
                rows={data}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                getRowId={getID}
                pageSizeOptions={[10]}
              />
            )}
          </div>
        </Grid>
      </Grid>
      <Popup open={open} setOpen={setOpen} title="Add One">
        <AddDepartement data={data} setData={setData} />
      </Popup>
    </>
  );
}

export default Departement;
