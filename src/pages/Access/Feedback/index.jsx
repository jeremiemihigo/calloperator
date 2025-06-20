import { Add, Edit } from "@mui/icons-material";
import { Fab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React from "react";
import { config, lien, lien_settings } from "static/Lien";
import Popup from "static/Popup";
import Formulaire from "./Formulaire";

function Feedback() {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [postes, setPostes] = React.useState();
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
  const loadingPoste = async () => {
    try {
      const response = await axios.get(lien_settings + "/readPoste", config);
      if (response.status === 200) {
        setPostes(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [data_edit, setDataEdit] = React.useState();
  React.useEffect(() => {
    loading();
    loadingPoste();
  }, []);
  const openPopup = (row) => {
    setDataEdit(row);
    setOpen(true);
  };
  const returnIncharge = (donner) => {
    if (donner && donner?.typecharge === "poste") {
      if (donner.postes) {
        return donner.postes.map((x) => x.title) + "; ";
      } else {
        return "";
      }
    } else {
      if (donner.role) {
        return donner.role.map((x) => x.title) + "; ";
      } else {
        return "";
      }
    }
  };
  const columns = [
    { field: "idFeedback", headerName: "ID", width: 20, editable: false },
    { field: "title", headerName: "Feedback", width: 400, editable: false },

    {
      field: "idRole",
      headerName: "In charge",
      width: 300,
      editable: false,
      renderCell: (p) => {
        return <>{returnIncharge(p.row)}</>;
      },
    },
    {
      field: "plateforme",
      headerName: "Plateforme",
      width: 130,
      editable: false,
    },
    {
      field: "typecharge",
      headerName: "Type",
      width: 100,
      editable: false,
    },
    {
      field: "savedby",
      headerName: "Saved by",
      width: 100,
      editable: false,
    },
    {
      field: "Options",
      headerName: "Edit",
      width: 70,
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
  const returnID = (row) => {
    return row._id;
  };

  return (
    <>
      <Fab
        size="small"
        color="primary"
        onClick={() => {
          setDataEdit();
          setOpen(true);
        }}
      >
        <Add fontSize="small" />
      </Fab>
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
            getRowId={returnID}
            pageSizeOptions={[50]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        )}
      </div>

      <Popup open={open} setOpen={setOpen} title="Ajoutez un feedback">
        <Formulaire postes={postes} data={data} setData={setData} />
      </Popup>
      {data_edit && (
        <Popup open={open} setOpen={setOpen} title="Edit">
          <Formulaire
            postes={postes}
            data_edit={data_edit}
            data={data}
            setData={setData}
          />
        </Popup>
      )}
    </>
  );
}

export default Feedback;
