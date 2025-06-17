import { Delete, Edit } from "@mui/icons-material";
import { Box, Paper, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import { IconMessage } from "@tabler/icons-react";
import axios from "axios";
import _ from "lodash";
import moment from "moment";
import React from "react";
import { useLocation, useNavigate } from "react-router";
import { config, lien } from "src/static/Lien";
import Popup from "src/static/Popup";
import CountdownTimer from "src/static/Rebour";
import DirectionSnackbar from "src/static/SnackBar";
import ListeCout from "../Projet/ListeCout";
import "../Projet/projet.style.css";
import FormProspect from "./AddProspect";

function ListeProspect({ donner }) {
  const location = useLocation();
  const [opencout, setOpencout] = React.useState(false);
  const [datacout, setDataCout] = React.useState();
  const returnMontant = (index) => {
    return _.reduce(
      index,
      function (curr, next) {
        return curr + next.cout;
      },
      0
    );
  };
  const [open, setOpen] = React.useState(false);
  const [dataedit, setDataEdit] = React.useState();
  const data = location?.state ? location.state : donner;
  const navigation = useNavigate();
  const clickCommentaire = (prospect, event) => {
    event.preventDefault();
    navigation("/commentaire", { state: { data: prospect, type: "prospect" } });
  };
  const lastComment = (index) => {
    if (index.commentaire && index?.commentaire.length > 0) {
      return (
        <Typography
          style={{
            fontSize: "12px",
            textAlign: "justify",
          }}
        >
          <span style={{ fontWeight: "bolder" }}>
            {index.commentaire[index.commentaire.length - 1].doby.split(
              " "
            )[1] + " : "}
          </span>
          <span>
            {index.commentaire[index.commentaire.length - 1].commentaire}
          </span>
        </Typography>
      );
    }
  };

  const clickProjet = (projet) => {
    navigation("/detail_projet", {
      state: { id: projet.id, type: "prospect" },
    });
  };
  const [message, setMessage] = React.useState("");
  const deleteProspect = async (id) => {
    try {
      setMessage("");
      const response = await axios.post(
        `${lien}/deleteprospect`,
        { id },
        config
      );
      if (response.status === 200) {
        window.location.replace("/prospects");
      } else {
        setMessage(response.data);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <>
      {message && <DirectionSnackbar message={message} />}
      <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
        {data &&
          (data?.length > 0 ? (
            data.map((index) => {
              return (
                <Paper
                  key={index._id}
                  elevation={2}
                  sx={{ padding: "10px", marginTop: "10px" }}
                >
                  <Grid container>
                    <Grid item size={{ lg: 10 }} className="projetname">
                      <div className="divtitleprojet">
                        <Typography
                          onClick={() => clickProjet(index)}
                          className="titreprojet"
                          noWrap
                        >
                          {index.name}
                        </Typography>
                        <div className="icon">
                          <Delete
                            onClick={() => deleteProspect(index.id)}
                            fontSize="small"
                          />
                          <Edit
                            onClick={() => {
                              setDataEdit(index);
                              setOpen(true);
                            }}
                            fontSize="small"
                          />
                        </div>
                      </div>
                      <Typography className="description">
                        {index.description}
                      </Typography>
                      {index?.projet && index?.projet.length > 0 && (
                        <Typography className="next_step" noWrap>
                          <span style={{ fontWeight: "bolder" }}>Projet</span> :{" "}
                          {index.projet[0].designation}
                        </Typography>
                      )}
                      <Typography className="next_step" noWrap>
                        <span style={{ fontWeight: "bolder" }}>Next_step</span>{" "}
                        : {index.next_step}
                      </Typography>

                      {lastComment(index)}

                      <Typography
                        color="textSecondary"
                        sx={{
                          fontSize: "10px",
                        }}
                      >
                        {moment(index.createdAt).fromNow()}
                      </Typography>
                    </Grid>
                    <Grid item size={{ lg: 2 }} className="display">
                      <div style={{ cursor: "pointer" }}>
                        <IconMessage
                          onClick={(event) => clickCommentaire(index, event)}
                          fontSize="small"
                        />
                      </div>

                      <Typography component="p" className="next_step" noWrap>
                        {index.statut}
                      </Typography>
                      <Typography
                        onClick={() => {
                          setDataCout(index);
                          setOpencout(true);
                        }}
                        component="p"
                        className="cout"
                        noWrap
                      >
                        Depense : ${returnMontant(index.cout)}
                      </Typography>
                      {index.deedline && (
                        <CountdownTimer
                          targetDate={index.deedline}
                          sx={{
                            fontSize: "12px",
                            color: "green",
                            textAlign: "center",
                          }}
                        />
                      )}
                    </Grid>
                  </Grid>
                </Paper>
              );
            })
          ) : (
            <p style={{ textAlign: "center", color: "red" }}>Aucun prospect</p>
          ))}
      </Box>
      {datacout && (
        <Popup
          open={opencout}
          setOpen={setOpencout}
          title={datacout?.designation}
        >
          <ListeCout concerne={datacout.id} />
        </Popup>
      )}
      <Popup open={open} setOpen={setOpen} title="Modifier le prospect">
        <FormProspect dataedit={dataedit} />
      </Popup>
    </>
  );
}

export default ListeProspect;
