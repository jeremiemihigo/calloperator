import { Badge, Button, Typography } from "@mui/material";
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
import FormProspect from "../Prospect/AddProspect";
import { ContexteProjet } from "./Context";
import FormProjet from "./FormProjet";
import ListeCout from "./ListeCout";
import "./projet.style.css";

const RecentTransactions = () => {
  const { projetListe, state } = React.useContext(ContexteProjet);
  const [openform, setOpenForm] = React.useState(false);
  const navigation = useNavigate();

  const [step, setStep] = React.useState();
  const allstep = useSelector((state) => state.steps?.step);

  React.useEffect(() => {
    if (allstep && allstep !== "token_expired") {
      setStep(allstep.filter((x) => x.concerne === "projet"));
    }
    if (allstep && allstep === "token_expired") {
      navigation("/auth/login");
    }
  }, [allstep]);

  const returnStep = (id) => {
    return _.filter(step, { id })[0].title;
  };

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
  const [statut, setStatut] = React.useState("all");
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
  const returnMontant = (index) => {
    return _.reduce(
      index,
      function (curr, next) {
        return curr + next.cout;
      },
      0
    );
  };
  const [opencout, setOpencout] = React.useState(false);
  const [datacout, setDataCout] = React.useState();

  const [openadd, setOpenAdd] = React.useState(false);
  const functionAddone = (donn) => {
    setDataCout(donn);
    setOpenAdd(true);
  };

  const [filterFn, setFilterFn] = React.useState({
    fn: (items) => {
      return items;
    },
  });

  React.useEffect(() => {
    setFilterFn({
      fn: (items) => {
        if (statut === "all") {
          return items;
        } else {
          return items.filter((x) => x.statut === statut);
        }
      },
    });
  }, [statut]);

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
              <Grid
                item
                size={{ lg: 3 }}
                style={{ padding: "3px", width: "15%" }}
                className="display_"
              >
                <Selected
                  label="Statut"
                  data={[{ id: 6, title: "Tous", value: "all" }, ...allstatus]}
                  value={statut}
                  setValue={setStatut}
                />
              </Grid>
            </Grid>
            {projetListe &&
              step &&
              step.length > 0 &&
              projetListe.length > 0 &&
              filterFn.fn(projetListe).map((index) => {
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
                        component="p"
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
                        <Typography
                          onClick={() => functionAddone(index.id)}
                          component="span"
                          sx={{ marginLeft: "20px" }}
                        >
                          Add Prospect
                        </Typography>
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
                        <Badge
                          badgeContent={
                            index?.commentaire ? index?.commentaire.length : 0
                          }
                          color="primary"
                        >
                          <IconMessage
                            onClick={(event) => clickCommentaire(index, event)}
                            fontSize="small"
                          />
                        </Badge>
                      </div>
                      <Typography component="p" className="next_step" noWrap>
                        Last Update {moment(index.updatedAt).fromNow()}
                      </Typography>
                      <Typography component="p" className="next_step" noWrap>
                        {index.statut}
                      </Typography>
                      <Grid
                        className="prix_total"
                        onClick={() => {
                          setDataCout(index);
                          setOpencout(true);
                        }}
                      >
                        <Typography component="p" className="cout" noWrap>
                          ${returnMontant(index.cout)}
                        </Typography>
                      </Grid>
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
      {datacout && (
        <Popup
          open={opencout}
          setOpen={setOpencout}
          title={datacout?.designation}
        >
          <ListeCout concerne={datacout.id} />
        </Popup>
      )}
      {datacout && (
        <Popup open={openadd} setOpen={setOpenAdd} title="Ajoutez un prospect">
          <FormProspect projetSelect={datacout} />
        </Popup>
      )}
    </>
  );
};

export default RecentTransactions;
