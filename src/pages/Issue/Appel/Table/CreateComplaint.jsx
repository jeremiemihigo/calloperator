import { Edit } from "@mui/icons-material";
import { Fab, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NoCustomer from "components/Attente";
import ConfirmDialog from "Control/ControlDialog";
import LoadingImage from "Control/Loading";
import { CreateContexteGlobal } from "GlobalContext";
import React from "react";
import { TimeCounter } from "static/Lien";
import { CreateContexteTable } from "../Contexte";
import Couleur from "./Color";

function CreateComplaint() {
  const [data, setData] = React.useState();
  const { socket, client } = React.useContext(CreateContexteGlobal);
  const { setPlainteSelect, setSelect } = React.useContext(CreateContexteTable);
  const loading = async () => {
    setData(client.filter((x) => x.statut === "awaiting_confirmation"));
  };
  React.useEffect(() => {
    loading();
  }, [client]);
  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const [nowCall, setNowCall] = React.useState();
  React.useEffect(() => {
    if (socket) {
      socket.on("appel", (donner) => {
        setNowCall(donner);
      });
    }
  }, [socket]);

  React.useEffect(() => {
    if (nowCall && nowCall.statut === "escalade") {
      setData([nowCall, ...data]);
    }
  }, [nowCall]);

  const openChat = (plainte) => {
    setPlainteSelect(plainte);
    setSelect(6);
  };

  const returnTime = (date1, date2) => {
    let resultat =
      (new Date(date2).getTime() - new Date(date1).getTime()) / 60000;
    if (resultat < 1) {
      return 1;
    } else {
      return resultat;
    }
  };

  const columns = [
    {
      field: "codeclient",
      headerName: "Code client",
      width: 120,
      editable: false,
    },
    {
      field: "idPlainte",
      headerName: "ID",
      width: 75,
      editable: false,
    },
    {
      field: "shop",
      headerName: "Shop",
      width: 100,
      editable: false,
    },
    {
      field: "contact",
      headerName: "Contact",
      width: 80,
      editable: false,
    },
    {
      field: "statut",
      headerName: "Statut",
      width: 150,
      editable: false,
      renderCell: (params) => {
        return <Couleur text={params.row.statut} />;
      },
    },
    {
      field: "typePlainte",
      headerName: "Type d'interventions",
      width: 130,
      editable: false,
    },
    {
      field: "plainteSelect",
      headerName: "Issue du client",
      width: 150,
      editable: false,
    },
    {
      field: "submitedBy",
      headerName: "Crées par ",
      width: 100,
      editable: false,
    },

    {
      field: "dateClose",
      headerName: "SLA",
      width: 120,
      editable: false,
      renderCell: (p) => {
        return TimeCounter(
          (
            p.row.time_delai - returnTime(p.row.fullDateSave, new Date())
          ).toFixed(0)
        );
      },
    },

    {
      field: "Action",
      headerName: "Action",
      width: 70,
      editable: false,
      renderCell: (params) => {
        return (
          <Fab
            size="small"
            color="primary"
            onClick={() => openChat(params.row)}
          >
            <Edit fontSize="small" />
          </Fab>
        );
      },
    },
  ];
  const getId = (p) => {
    return p._id;
  };

  return (
    <>
      {!data && <LoadingImage />}
      {data && data.length === 0 && (
        <NoCustomer texte="No relocation pending" />
      )}
      {data && data.length > 0 && (
        <Paper elevation={4}>
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
            getRowId={getId}
          />
        </Paper>
      )}

      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}

export default React.memo(CreateComplaint);
