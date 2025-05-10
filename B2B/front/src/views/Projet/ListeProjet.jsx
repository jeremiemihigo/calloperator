import { Button, TextField, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import { IconMessage } from "@tabler/icons-react";
import _ from "lodash";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import DashboardCard from "src/components/shared/DashboardCard";
import Popup from "src/static/Popup";
import { allstatus } from "../../static/Lien";
import Loading from "../../static/Loading";
import Selected from "../../static/Select";
import { ContexteProjet } from "./Context";
import FormProjet from "./FormProjet";
import "./projet.style.css";

const RecentTransactions = () => {
  const { projetListe, state } = React.useContext(ContexteProjet);
  const [openform, setOpenForm] = React.useState(false);
  const step = useSelector((state) =>
    state.steps.step.filter((x) => x.concerne === "projet")
  );
  const returnStep = (id) => {
    return _.filter(step, { id })[0].title;
  };

  const navigation = useNavigate();
  const clickProjet = (projet) => {
    navigation("/detail_projet", { state: projet });
  };
  const clickCommentaire = (projet, event) => {
    event.preventDefault();

    navigation("/commentaire", { state: { data: projet, type: "projet" } });
  };
  const clickProspect = (projet, event) => {
    event.preventDefault();

    navigation("/prospects", { state: projet });
  };
  const returnclasse = (stat) => {
    if (stat === "En cours") {
      return "encours";
    }
    if (stat === "En pause") {
      return "pause";
    }
    if (stat === "Abandonner") {
      return "abandonner";
    }
  };
  const [statut, setStatut] = React.useState("");
  const lastComment = (index) => {
    if (index?.commentaire && index?.commentaire.length > 0) {
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

  return (
    <>
      {state.etat ? (
        <Loading />
      ) : (
        <DashboardCard
          title={state?.titre.title}
          subtitle="Tous les projets ayant cette catégorie"
          action={
            <>
              <Button
                onClick={() => setOpenForm(true)}
                color="primary"
                variant="contained"
              >
                Nouveau projet
              </Button>
            </>
          }
        >
          <>
            <Grid container>
              <Grid item size={{ lg: 6 }} className="display_">
                <TextField
                  name="id"
                  label="ID Projet"
                  id="id"
                  variant="outlined"
                  fullWidth
                  sx={{
                    mt: 2,
                    mb: 2,
                    minWidth: "20rem",
                  }}
                />
              </Grid>
              <Grid
                item
                size={{ lg: 3 }}
                style={{ padding: "3px", width: "15%" }}
                className="display_"
              >
                <Selected
                  label="Statut"
                  data={[...allstatus, { id: 4, title: "Tous", value: "all" }]}
                  value={statut}
                  setValue={setStatut}
                />
              </Grid>
            </Grid>
            {projetListe &&
              step &&
              step.length > 0 &&
              projetListe.length > 0 &&
              projetListe.map((index) => {
                return (
                  <Grid
                    container
                    key={index._id}
                    className={returnclasse(index.statut)}
                  >
                    <Grid item size={{ lg: 10 }} className="projetname">
                      <Typography className="titreprojet">
                        {index.id} #
                        <span onClick={() => clickProjet(index)}>
                          {index.designation}
                        </span>
                      </Typography>
                      <Typography className="description">
                        {index.description}
                      </Typography>
                      <Typography className="next_step" noWrap>
                        Next : {returnStep(index.next_step)}
                      </Typography>

                      <Typography
                        onClick={(event) =>
                          index?.prospects.length > 0 &&
                          clickProspect(index?.prospects, event)
                        }
                        style={{
                          fontSize: "12px",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        {index?.prospects?.length}
                        {index?.prospects?.length > 1
                          ? "prospects"
                          : " prospect"}
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
                        Last Update {moment(index.updatedAt).fromNow()}
                      </Typography>
                      <Typography component="p" className="next_step" noWrap>
                        <p>{index.statut}</p>
                      </Typography>
                    </Grid>
                  </Grid>
                );
              })}
          </>
        </DashboardCard>
      )}

      <Popup open={openform} setOpen={setOpenForm} title="Project">
        <FormProjet />
      </Popup>
    </>
  );
};

export default RecentTransactions;
