/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Delete, Edit, ResetTvOutlined } from "@mui/icons-material";
import { Box, Fab, Tooltip, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DirectionSnackbar from "Control/SnackBar";
import { Button, Image } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { config, lien } from "static/Lien";
import Popup from "static/Popup";
import AgentAdmin from "./AgentAdmin";

function AgentListeAdmin() {
  const theme = useTheme();
  const userAdmin = useSelector((state) => state.agentAdmin?.agentAdmin);
  const [agentEdit, setAgentEdit] = React.useState();
  const [openEdit, setOpenEdit] = React.useState(false);
  const role = useSelector((state) => state.role.role);
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [message, setMessage] = useState("");

  const bloquerAgent = async (agent) => {
    const response = await axios.put(
      lien + "/bloquerAgentAdmin",
      { id: agent._id, value: !agent.active },
      config
    );
    if (response.status === 200) {
      window.location.replace("/access");
    } else {
      setMessage("" + response.data);
      setOpen(true);
    }
  };
  const resetPassword = async (agent) => {
    const response = await axios.post(
      lien + "/resetAdmin",
      { id: agent._id },
      config
    );
    if (response.status === 200) {
      window.location.replace("/access");
    } else {
      setMessage("" + response.data);
      setOpen(true);
    }
  };
  const clickEdit = (agent) => {
    setAgentEdit(agent);
    setOpenEdit(true);
  };

  const columns = [
    {
      field: "avatar",
      headerName: "#",
      width: 70,
      editable: false,
      renderCell: (p) => {
        return (
          <Image
            width={40}
            height={35}
            style={{ borderRadius: "50%" }}
            src={p.row.filename || "/profile.png"}
            placeholder={
              <Image
                preview={true}
                src={p.row.filename || "/profile.png"}
                // width={200}
              />
            }
          />
        );
      },
    },
    {
      field: "codeAgent",
      headerName: "Code",
      width: 120,
      editable: false,
    },
    {
      field: "nom",
      headerName: "NOMS",
      width: 200,
      editable: false,
    },
    {
      field: "fonction",
      headerName: "Fonction",
      width: 150,
      editable: false,
      renderCell: (p) => {
        return (
          <>{p.row.fonction === "co" ? "Call operator" : p.row.fonction}</>
        );
      },
    },
    {
      field: "active",
      headerName: "Status",
      width: 70,
      editable: false,
      renderCell: (p) => {
        return (
          <>
            {p.row.active ? (
              <Box
                sx={{
                  bgcolor: theme.palette.success.main,
                  width: "100%",
                  borderRadius: "5px",
                  textAlign: "center",
                }}
              >
                Actif
              </Box>
            ) : (
              <Box
                sx={{
                  bgcolor: theme.palette.warning.main,
                  width: "100%",
                  borderRadius: "5px",
                  textAlign: "center",
                }}
              >
                Inactif
              </Box>
            )}
          </>
        );
      },
    },
    {
      field: "role",
      headerName: "Departement",
      width: 150,
      editable: false,
      renderCell: (p) => {
        return (
          <>{p.row.departement.length > 0 ? p.row.departement[0].title : ""}</>
        );
      },
    },
    {
      field: "poste",
      headerName: "Poste",
      width: 150,
      editable: false,
      renderCell: (p) => {
        return <>{p.row.poste.length > 0 ? p.row.poste[0].title : ""}</>;
      },
    },
    {
      field: "value",
      headerName: "Affectation",
      width: 150,
      editable: false,
      renderCell: (p) => {
        return (
          <>
            {p.row?.valuefilter?.length > 0 &&
              p.row.valuefilter.map((x) => x + "--")}
          </>
        );
      },
    },
    {
      field: "reset",
      headerName: "Reset",
      width: 150,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            <Tooltip title="Reset password">
              <Fab
                color="primary"
                size="small"
                onClick={() => resetPassword(params.row)}
              >
                <ResetTvOutlined fontSize="small" />
              </Fab>
            </Tooltip>
            <Tooltip title="Edit">
              <Fab
                onClick={() => clickEdit(params.row)}
                color="info"
                size="small"
                sx={{ margin: "0px 10px" }}
              >
                <Edit fontSize="small" />
              </Fab>
            </Tooltip>
            <Tooltip title={params.row.active ? "Blocked" : "Unblocked"}>
              <Fab
                color="warning"
                size="small"
                onClick={() => bloquerAgent(params.row)}
              >
                <Delete fontSize="small" />
              </Fab>
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "5px" }}>
      {open && message !== "" && (
        <DirectionSnackbar open={open} setOpen={setOpen} message={message} />
      )}
      <Button type="primary" onClick={() => setOpenForm(true)}>
        Ajoutez un agent
      </Button>
      <div>
        {userAdmin && role && (
          <DataGrid
            rows={userAdmin}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 50,
                },
              },
            }}
            pageSizeOptions={[50]}
          />
        )}
      </div>
      <Popup open={openForm} setOpen={setOpenForm} title="Agent">
        <AgentAdmin />
      </Popup>
      {agentEdit && (
        <Popup
          open={openEdit}
          setOpen={setOpenEdit}
          title={`Modification de l'agent ${agentEdit?.nom}`}
        >
          <AgentAdmin agentselect={agentEdit} />
        </Popup>
      )}
    </div>
  );
}

export default AgentListeAdmin;
