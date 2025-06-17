import { Delete, ViewAgenda } from "@mui/icons-material";
import { Chip, Fab, Grid, Tooltip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import ConfirmDialog from "Control/ControlDialog";
import moment from "moment";
import React from "react";
import { config, lien_dt, lien_settings } from "static/Lien";
import Popup from "static/Popup";
import AddDepartement from "./AddDepartement";
import "./department.style.css";
import ShowPoste from "./ShowPoste";

function Departement() {
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [dataselect, seDataselect] = React.useState();
  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
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

  const handleDelete = async (id) => {
    try {
      setConfirmDialog({
        ...confirmDialog,
        isOpen: false,
      });
      seDataselect();
      const response = await axios.post(
        `${lien_settings}/deleteDepartement`,
        { id },
        config
      );
      if (response.status === 200) {
        setData(data.filter((x) => x.idRole !== response.data));
      }
      if (response.status === 201) {
        alert(JSON.stringify(response.data));
      }
    } catch (error) {
      alert(JSON.stringify(error.message));
    }
  };

  const columns = [
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
      field: "title",
      headerName: "Departement",
      width: 300,
      editable: false,
    },

    {
      field: "reset",
      headerName: "Options",
      width: 150,
      editable: false,
      renderCell: (p) => {
        return (
          <>
            <Tooltip title="View post">
              <Fab
                onClick={() => seDataselect(p.row)}
                color="primary"
                size="small"
              >
                <ViewAgenda />
              </Fab>
            </Tooltip>
            <Tooltip title="Delete">
              <Fab
                onClick={() => handleDelete(p.row.idRole)}
                color="warning"
                sx={{ marginLeft: "10px" }}
                size="small"
              >
                <Delete />
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
          <Grid
            className="ajouter"
            onClick={() => {
              seDataselect();
              setOpen(true);
            }}
          >
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
        <Grid item lg={6}>
          <ShowPoste posteselect={dataselect} />
          <div style={{ marginTop: "20px" }}>
            {dataselect && dataselect?.postes.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  fontWeight: "bolder",
                  color: "red",
                  marginTop: "10px",
                }}
              >
                Aucun poste enregistré dans le département {dataselect?.title}
              </p>
            )}
            {dataselect &&
              dataselect?.postes.length > 0 &&
              dataselect?.postes.map((item) => {
                return (
                  <Chip
                    sx={{ margin: "2px" }}
                    key={item._id}
                    label={item.title}
                  />
                );
              })}
          </div>
        </Grid>
      </Grid>
      <Popup open={open} setOpen={setOpen} title="Add department">
        <AddDepartement data={data} setData={setData} />
      </Popup>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}

export default Departement;
