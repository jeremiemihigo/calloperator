import { Button, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import { IconMessage } from "@tabler/icons-react";
import _ from "lodash";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import DashboardCard from "src/components/shared/DashboardCard";
import Popup from "src/static/Popup";
import FormProjet from "./FormProjet";
import "./projet.style.css";

const RecentTransactions = () => {
  const projet = useSelector((state) => state.projet);
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

  return (
    <>
      <DashboardCard
        title="Projets"
        subtitle="Tous les projets"
        action={
          <>
            <Button
              onClick={() => setOpenForm(true)}
              color="primary"
              variant="contained"
            >
              New project
            </Button>
          </>
        }
      >
        <>
          {projet &&
            step &&
            step.length > 0 &&
            projet.projet.length > 0 &&
            projet.projet.map((index) => {
              return (
                <Grid
                  container
                  key={index._id}
                  className={returnclasse(index.statut)}
                >
                  <Grid item size={{ lg: 10 }} className="projetname">
                    <Typography
                      className="titreprojet"
                      onClick={() => clickProjet(index)}
                    >
                      #{index.designation}{" "}
                    </Typography>
                    <Typography className="description">
                      {index.description}
                    </Typography>
                    <Typography className="next_step" noWrap>
                      Next : {returnStep(index.next_step)}
                    </Typography>

                    <Typography
                      onClick={(event) =>
                        clickProspect(index?.prospects, event)
                      }
                      style={{
                        fontSize: "12px",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      {index?.prospects?.length}
                      {index?.prospects?.length > 1 ? "prospects" : " prospect"}
                    </Typography>

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
      <Popup open={openform} setOpen={setOpenForm} title="Project">
        <FormProjet />
      </Popup>
    </>
  );
};

export default RecentTransactions;
