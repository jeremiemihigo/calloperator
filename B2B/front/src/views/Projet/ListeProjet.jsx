import { Badge, Button, Paper, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import _ from "lodash";
import moment from "moment";
import React from "react";
import { useNavigate } from "react-router";
import DashboardCard from "src/components/shared/DashboardCard";
import Popup from "src/static/Popup";
import { allstatus } from "../../static/Lien";
import Loading from "../../static/Loading";
import CountdownTimer from "../../static/Rebour";
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

  const clickProjet = (projet) => {
    navigation("/detail_projet", { state: { id: projet.id, type: "projet" } });
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
          </>
        </DashboardCard>
      )}
      {projetListe &&
        projetListe.length > 0 &&
        filterFn.fn(projetListe).map((index) => {
          return (
            <Paper
              key={index._id}
              elevation={2}
              sx={{ padding: "10px", marginTop: "10px" }}
            >
              <Grid container>
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
                  <Typography className="next_step" noWrap component="p">
                    Next : {index.next_step}{" "}
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
                    {index?.prospects?.length > 1 ? "prospects" : " prospect"}
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
                    component="p"
                    sx={{
                      fontSize: "10px",
                    }}
                  >
                    {moment(index.createdAt).fromNow()}

                    <Badge
                      badgeContent={
                        index?.commentaire ? index?.commentaire.length : 0
                      }
                      color="primary"
                    >
                      <Typography
                        onClick={(event) => clickCommentaire(index, event)}
                        sx={{ marginLeft: "20px", cursor: "pointer" }}
                        component="span"
                      >
                        Comment
                      </Typography>
                    </Badge>
                  </Typography>
                </Grid>
                <Grid item size={{ lg: 2 }} className="display">
                  <Grid
                    onClick={() => {
                      setDataCout(index);
                      setOpencout(true);
                    }}
                    className="leftcontent"
                  >
                    <div className="prix_total">
                      <Typography component="p" className="cout" noWrap>
                        Depense : ${returnMontant(index.cout)}
                      </Typography>
                      <Typography component="p" noWrap>
                        Statut : {index.statut}
                      </Typography>
                    </div>
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
              </Grid>
            </Paper>
          );
        })}

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
