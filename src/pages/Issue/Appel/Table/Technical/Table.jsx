import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { message } from "antd";
import axios from "axios";
import NoCustomer from "components/Attente";
import SimpleBackdrop from "Control/Backdrop";
import LoadingImage from "Control/Loading";
import { CreateContexteGlobal } from "GlobalContext";
import moment from "moment";
import AffectTech from "pages/Issue/Appel/AffectTech";
import { CreateContexteTable } from "pages/Issue/Appel/Contexte";
import RaisonFermeture from "pages/Issue/Appel/Formulaire/RaisonFermeture";
import Couleur from "pages/Issue/Appel/Table/Color";
import Options from "pages/Issue/Appel/Table/Options";
import ValiderAction from "pages/Issue/Appel/ValiderAction";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { config, lien_issue, returnTime } from "static/Lien";
import Popup from "static/Popup";

function ThisMonth_Tech() {
  const [data, setData] = React.useState();
  const [seach, setSeach] = React.useState(false);
  const { client, setClient } = React.useContext(CreateContexteGlobal);
  const { setPlainteSelect, setSelect } = React.useContext(CreateContexteTable);
  const location = useLocation();
  const [openFermeture, setOpenFermeture] = React.useState(false);
  const [idPlainte, setIdPlainte] = React.useState();
  const fermeture = (plainte) => {
    setIdPlainte(plainte);
    setOpenFermeture(true);
  };
  const loading = () => {
    try {
      setSeach(true);
      const { state, statut } = location.state;

      if (client && state === "technicien") {
        setData(
          client.filter(
            (x) => x.type === "ticket" && x.technicien === undefined
          )
        );
        setSeach(false);
      }
      if (client && state === "encours") {
        setData(
          client.filter(
            (x) =>
              x.statut === "Open_technician_visit" && x.technicien !== undefined
          )
        );
        setSeach(false);
      }
      if (client && state === "callcenter") {
        setData(
          client.filter((x) => x.statut === "resolved_awaiting_confirmation")
        );
        setSeach(false);
      }
      if (!state && statut) {
        setData(client.filter((x) => x.statut === statut));
        setSeach(false);
      }
      if (
        !["technicien", "encours", "callcenter"].includes(state) &&
        statut === ""
      ) {
        setData(client.filter((x) => x?.technicien?.codeTech === state));
        setSeach(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useLayoutEffect(() => {
    loading();
  }, [client, location]);

  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: "" + texte,
      duration: 5,
    });
  };

  const [open, setOpen] = React.useState(false);
  const [clientselect, setCustomer] = React.useState();
  const openForm = (e, row) => {
    e.preventDefault();
    setCustomer(row);
    setOpen(true);
  };

  const [sending, setSending] = React.useState(false);

  const apresAssistance = async (row) => {
    try {
      if (!row.technicien) {
        success("The ticket is not assigned to a technician", "error");
      } else {
        setSending(true);

        const response = await axios.post(
          `${lien_issue}/assistance_ticket`,
          { num_ticket: row.idPlainte },
          config
        );
        if (response.status === 200) {
          success("Done", "success");
          setClient(
            client.map((x) => (x._id === response.data._id ? response.data : x))
          );
          setSending(false);
        } else {
          success("" + response.data, "error");
          setSending(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [openV, setOpenV] = React.useState(false);
  const [clientV, setClientV] = React.useState();
  const Validation = (d) => {
    setClientV(d);
    setOpenV(true);
  };

  const openChat = (plainte, e) => {
    e.preventDefault();
    setPlainteSelect(plainte);
    setSelect(3);
  };

  function TimeCounter(durationInMinutes) {
    let [remainingTimeInSeconds, setRemainingTimeInSeconds] =
      useState(durationInMinutes);
    React.useEffect(() => {
      const interval = setInterval(() => {
        setRemainingTimeInSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      // Nettoyage du timer à la fin
      return () => clearInterval(interval);
    }, [durationInMinutes]);

    if (remainingTimeInSeconds <= 0) {
      return (
        <p
          style={{
            background: "red",
            padding: "0px",
            margin: "0px",
            height: "50%",
            fontSize: "12px",
            color: "white",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          OUT SLA
        </p>
      );
    } else {
      const days = Math.floor(remainingTimeInSeconds / (24 * 3600));
      const hours = Math.floor((remainingTimeInSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((remainingTimeInSeconds % 3600) / 60);
      const seconds = remainingTimeInSeconds % 60;
      return (
        <p
          style={{
            background: "green",
            padding: "0px",
            margin: "0px",
            height: "50%",
            fontSize: "12px",
            color: "white",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >{`
        ${days + "jr"} ${hours + "h"} ${minutes + "m"} ${seconds + "s"}
        `}</p>
      );
    }
  }

  const columns = [
    {
      field: "codeclient",
      headerName: "Code client",
      width: 110,
      editable: false,
    },
    {
      field: "idPlainte",
      headerName: "Num_ticket",
      width: 90,
      editable: false,
    },
    {
      field: "actionSynchro",
      headerName: "Synchro",
      width: 90,
      editable: false,
      renderCell: (p) => {
        return p.row?.technicien?.numSynchro;
      },
    },
    {
      field: "statut",
      headerName: "Statut",
      width: 200,
      editable: false,
      renderCell: (params) => {
        return <Couleur text={params.row.statut} />;
      },
    },

    {
      field: "plainteSelect",
      headerName: "Issue",
      width: 150,
      editable: false,
    },
    {
      field: "shop",
      headerName: "Shop",
      width: 120,
      editable: false,
    },
    {
      field: "Tech",
      headerName: "Tech",
      width: 80,
      editable: false,
      renderCell: (p) => {
        return p.row.technicien?.codeTech;
      },
    },
    {
      field: "dateSave",
      headerName: "Date open",
      width: 75,
      editable: false,
      renderCell: (p) => {
        return moment(p.row.dateSave).format("DD-MM-YYYY");
      },
    },
    {
      field: "submitedBy",
      headerName: "Saved by",
      width: 90,
      editable: false,
      renderCell: (p) => {
        return p.row.submitedBy;
      },
    },
    {
      field: "SLA",
      headerName: "SLA",
      width: 130,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            {params.row.open ? (
              TimeCounter(
                (params.row.time_delai -
                  returnTime(params.row.fullDateSave, new Date()).toFixed(0)) *
                  60
              )
            ) : (
              <Couleur text={params.row?.delai} />
            )}
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      editable: false,
      renderCell: (p) => {
        return (
          <Options
            client={p.row}
            openChat={openChat}
            validation={Validation}
            apresAssistance={apresAssistance}
            openForm={openForm}
            fermeture={fermeture}
          />
        );
      },
    },
  ];
  const getId = (p) => {
    return p._id;
  };
  return (
    <>
      {contextHolder}
      {sending && (
        <SimpleBackdrop open={true} title="Please wait" taille="10rem" />
      )}
      {seach && <LoadingImage />}
      {!seach && data && data.length > 0 && (
        <Paper elevation={4}>
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 100,
                },
              },
            }}
            pageSizeOptions={[100]}
            disableRowSelectionOnClick
            getRowId={getId}
          />
        </Paper>
      )}
      {!seach && data && data.length === 0 && (
        <NoCustomer texte="No pending technical complaints" />
      )}
      {clientselect && (
        <Popup open={open} setOpen={setOpen} title="Affectation tech">
          <AffectTech clients={clientselect} />
        </Popup>
      )}
      {clientV && (
        <Popup open={openV} setOpen={setOpenV} title="Check">
          <ValiderAction clients={clientV} close={setOpenV} />
        </Popup>
      )}

      <Popup open={openFermeture} setOpen={setOpenFermeture} title="Fermeture">
        <RaisonFermeture idPlainte={idPlainte} />
      </Popup>
    </>
  );
}
export default React.memo(ThisMonth_Tech);
