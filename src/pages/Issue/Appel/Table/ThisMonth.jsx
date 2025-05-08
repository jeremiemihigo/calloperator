import { Edit, EscalatorSharp } from "@mui/icons-material";
import { Fab, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { message } from "antd";
import NoCustomer from "components/Attente";
import LoadingImage from "Control/Loading";
import { CreateContexteGlobal } from "GlobalContext";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { config, lien_issue, returnName } from "static/Lien";
import Popup from "static/Popup";
import { Paper } from "../../../../../node_modules/@mui/material/index";
import { CreateContexteTable } from "../Contexte";
import WhyEdit from "../Formulaire/WhyEdit";
import Couleur from "./Color";

function AllCall() {
  const [data, setData] = React.useState();
  const { client, setClient } = React.useContext(CreateContexteGlobal);
  const location = useLocation();

  const { setPlainteSelect, setSelect } = React.useContext(CreateContexteTable);
  const user = useSelector((state) => state.user?.user);
  const loading = async () => {
    const statut = location?.state?.statut;
    if (client && !statut) {
      setData(
        client.filter((x) => x.type === "appel" && x.statut !== "escalade")
      );
    }
    if (client && statut) {
      setData(client.filter((x) => x.statut === statut));
    }
  };
  React.useEffect(() => {
    loading();
  }, [client]);
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: "" + texte,
      duration: 5,
    });
  };

  const changeStatus = async (row, statut) => {
    try {
      if (user.nom !== row.submitedBy) {
        success(
          `seulement ${row.submitedBy} peut effectuer cette operation`,
          "error"
        );
      } else {
        const { _id } = row;
        const data =
          statut === "escalade"
            ? { id: _id, data: { operation: "backoffice", statut } }
            : { id: _id, data: { statut, open: false } };
        const response = await axios.post(
          `${lien_issue}/updateappel`,
          data,
          config
        );
        if (response.status === 200) {
          success("Done", "success");
          setClient(
            client.map((x) => (x._id === response.data._id ? response.data : x))
          );
        } else {
          success("" + response.data, "error");
        }
      }
    } catch (error) {
      success("" + error, "error");
    }
  };

  const openChat = (plainte) => {
    setPlainteSelect(plainte);
    setSelect(3);
  };
  const [openEdit, setOpenEdit] = React.useState(false);
  const [plainte, setPlainte] = React.useState();
  const func_openEdit = (e, a) => {
    e.preventDefault();
    setPlainte(a);
    setOpenEdit(true);
  };
  const columns = [
    {
      field: "codeclient",
      headerName: "Code client",
      width: 120,
      editable: false,
    },
    {
      field: "shop",
      headerName: "Shop",
      width: 100,
      editable: false,
    },
    {
      field: "property",
      headerName: "Provenance",
      width: 80,
      editable: false,
    },

    {
      field: "statut",
      headerName: "Statut",
      width: 120,
      editable: false,
      renderCell: (params) => {
        return (
          <Couleur
            onClick={() =>
              params.row.statut === "ongoing" &&
              params.row.operation !== "backoffice" &&
              changeStatus(params.row, "closed")
            }
            text={params.row.statut}
          />
        );
      },
    },
    {
      field: "typePlainte",
      headerName: "Type Plainte",
      width: 100,
      editable: false,
    },
    {
      field: "plainteSelect",
      headerName: "Plainte",
      width: 150,
      editable: false,
    },
    {
      field: "submitedBy",
      headerName: "Saved By",
      width: 100,
      editable: false,
      renderCell: (params) => {
        return returnName(params.row.submitedBy);
      },
    },
    {
      field: "recommandation",
      headerName: "recommandation",
      width: 120,
      editable: false,
    },
    {
      field: "raisonOngoing",
      headerName: "Why ongoing",
      width: 100,
      editable: false,
    },
    {
      field: "delai",
      headerName: "Delai",
      width: 80,
      editable: false,
      renderCell: (params) => {
        return <Couleur text={params.row.delai} taille={10} />;
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
      field: "Action",
      headerName: "Action",
      width: 150,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            <Tooltip title="Suivi">
              <Fab
                sx={{ marginRight: "5px" }}
                size="small"
                color="primary"
                onClick={() => openChat(params.row)}
              >
                {params.row.message ? params.row.message.length : 0}
              </Fab>
            </Tooltip>
            {params.row.statut === "ongoing" && (
              <Tooltip title="Escalader vers le Backoffice">
                <Fab
                  onClick={() => changeStatus(params.row, "escalade")}
                  sx={{ marginRight: "5px" }}
                  size="small"
                  color="primary"
                >
                  <EscalatorSharp fontSize="small" />
                </Fab>
              </Tooltip>
            )}
            <Tooltip title="Edit">
              <Fab
                onClick={(e) => func_openEdit(e, params.row)}
                sx={{ margin: "5px" }}
                size="small"
                color="secondary"
              >
                <Edit fontSize="small" />
              </Fab>
            </Tooltip>
          </>
        );
      },
    },
  ];
  const getId = (p) => {
    return p._id;
  };
  return (
    <div>
      {contextHolder}
      {!data && <LoadingImage />}
      {data && data.length === 0 && (
        <NoCustomer texte="No pending non-technical complaints" />
      )}
      <Paper elevation={3}>
        {data && data.length > 0 && (
          <div style={{ width: "100%" }}>
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
          </div>
        )}
      </Paper>
      <Popup
        open={openEdit}
        setOpen={setOpenEdit}
        title="Why do you want to edit ?"
      >
        <WhyEdit row={plainte} />
      </Popup>
    </div>
  );
}

export default React.memo(AllCall);
