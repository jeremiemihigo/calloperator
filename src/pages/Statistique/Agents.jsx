/* eslint-disable react/prop-types */
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import { Fab, Grid, Paper, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Input } from "antd";
import _ from "lodash";
import React from "react";
import Popup from "static/Popup";
import AfficheInfo from "./AfficheInfo";

function Agents({ listeDemande }) {
  const [donnee, setDonnees] = React.useState();
  const [show, setShow] = React.useState(false);
  const [dataToShow, setDataToShow] = React.useState();
  const sendDetails = (e, code) => {
    e.preventDefault();
    setDataToShow(_.filter(listeDemande, { codeAgent: code }));
    setShow(true);
  };
  const analyse = () => {
    const donne = _.groupBy(listeDemande, "codeAgent");
    try {
      let table = [];
      let donnerKey = Object.keys(donne);
      for (let i = 0; i < donnerKey.length; i++) {
        table.push({
          nom: listeDemande.filter((x) => x.agent.codeAgent === donnerKey[i])[0]
            .agent.nom,
          code: donnerKey[i],
          nonRepondu: listeDemande.filter(
            (x) =>
              x.agent.codeAgent === donnerKey[i] &&
              x.reponse.length === 0 &&
              !x.valide &&
              x.feedback === "new"
          ).length,
          doublon: listeDemande.filter(
            (x) =>
              x.agent.codeAgent === donnerKey[i] &&
              !x.valide &&
              x.feedback === "doublon"
          ).length,

          repondu: listeDemande.filter(
            (x) =>
              x.agent.codeAgent === donnerKey[i] &&
              x.reponse.length > 0 &&
              x.valide
          ).length,
          followup: listeDemande.filter(
            (x) =>
              x.agent.codeAgent === donnerKey[i] &&
              !x.valide &&
              x.feedback === "followup"
          ).length,
          nonconforme: listeDemande.filter(
            (x) =>
              x.agent.codeAgent === donnerKey[i] &&
              x.feedback === "chat" &&
              !x.valide
          ).length,

          total: listeDemande.filter((x) => x.agent.codeAgent === donnerKey[i])
            .length,
          id: i,
        });
      }
      setDonnees(_.orderBy(table, "total", "desc"));
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    analyse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listeDemande]);
  const [filterFn, setFilterFn] = React.useState({
    fn: (items) => {
      return items;
    },
  });
  const handleChanges = (e) => {
    let target = e.target.value.toUpperCase();

    setFilterFn({
      fn: (items) => {
        if (target === "") {
          return items;
        } else {
          return items.filter(
            (x) => x.code.includes(target) || x.nom.includes(target)
          );
        }
      },
    });
  };
  const columns = [
    {
      field: "nom",
      headerName: "Nom Agent",
      width: 300,
      editable: false,
    },

    {
      field: "code",
      headerName: "Code Agent",
      width: 130,
      editable: false,
    },
    {
      field: "repondu",
      headerName: "Conformes",
      width: 80,
      editable: false,
    },
    {
      field: "nonconforme",
      headerName: "Non conforme",
      width: 100,
      editable: false,
    },
    {
      field: "followup",
      headerName: "Followup",
      width: 80,
      editable: false,
    },
    {
      field: "nonRepondu",
      headerName: "Attentes",
      width: 70,
      editable: false,
    },
    {
      field: "doublon",
      headerName: "Doublon",
      width: 70,
      editable: false,
    },
    {
      field: "total",
      headerName: "Total",
      width: 70,
      editable: false,
    },

    {
      field: "action",
      headerName: "Action",
      width: 100,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            <Tooltip
              title="Plus les détails"
              onClick={(e) => sendDetails(e, params.row.code)}
            >
              <Fab size="small" color="primary">
                <MedicalInformationIcon fontSize="small" />
              </Fab>
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Grid container>
        <Grid item lg={12} xs={12}>
          <Paper elevation={3} sx={{ padding: "10px", margin: "10px 0px" }}>
            <Input
              onChange={(e) => handleChanges(e)}
              placeholder="Cherchez le Code agent ou nom Agent"
            />
          </Paper>
          <Paper elevation={3}>
            {donnee && (
              <div style={{ width: "100%" }}>
                <DataGrid
                  rows={filterFn.fn(donnee)}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 10,
                      },
                    },
                  }}
                  pageSizeOptions={[10]}
                  disableRowSelectionOnClick
                  checkboxSelection
                />
              </div>
            )}
          </Paper>
        </Grid>
      </Grid>

      {dataToShow && (
        <Popup
          open={show}
          setOpen={setShow}
          title={`pour ${dataToShow[0].agent.nom} -------- code : ${dataToShow[0].agent.codeAgent}`}
        >
          <AfficheInfo data={dataToShow} />
        </Popup>
      )}
    </>
  );
}

export default Agents;
