import { Delete, Edit } from "@mui/icons-material";
import { Badge, Button, Paper, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import { IconMessage } from "@tabler/icons-react";
import axios from "axios";
import _ from "lodash";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import DashboardCard from "src/components/shared/DashboardCard";
import { allstatus, config, lien } from "src/static/Lien";
import Loading from "src/static/Loading";
import Popup from "src/static/Popup";
import CountdownTimer from "src/static/Rebour";
import Selected from "src/static/Select";
import DirectionSnackbar from "src/Static/SnackBar";
import FormProspect from "../Prospect/AddProspect";
import { ContexteProjet } from "./Context";
import FormProjet from "./FormProjet";
import ListeCout from "./ListeCout";
import "./projet.style.css";

const RecentTransactions = () => {
  const { projetListe, setProjetListe, state } =
    React.useContext(ContexteProjet);
  const [openform, setOpenForm] = React.useState(false);
  const [dataedit, setDataEdit] = React.useState();
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
  const user = useSelector((state) => state.user.user);
  const returnVue = (comment) => {
    let nombre = 0;
    for (let i = 0; i < comment.length; i++) {
      if (!comment[i]?.vu?.includes(user.username)) {
        nombre = nombre + 1;
      }
    }
    return nombre;
  };
  const [message, setMessage] = React.useState("");
  const deleteprojet = async (id) => {
    try {
      setMessage("");
      const response = await axios.post(`${lien}/deleteProjet`, { id }, config);
      if (response.status === 200) {
        setProjetListe(projetListe.filter((x) => x.id !== response.data));
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
      {state.etat ? (
        <Loading />
      ) : (
        <DashboardCard
          title={state?.titre.title}
          subtitle="Tous les projets ayant cette catégorie"
          action={
            <>
              <Button
                onClick={() => {
                  setDataEdit();
                  setOpenForm(true);
                }}
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
        projetListe?.length > 0 &&
        filterFn.fn(projetListe).map((index) => {
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
                      {index.designation}
                    </Typography>
                    <div className="icon">
                      <Delete
                        onClick={() => deleteprojet(index.id)}
                        fontSize="small"
                      />
                      <Edit
                        onClick={() => {
                          setDataEdit(index);
                          setOpenForm(true);
                        }}
                        fontSize="small"
                      />
                    </div>
                  </div>

                  <Typography className="description">
                    {index.description}
                  </Typography>
                  <Typography className="next_step" noWrap component="p">
                    Next : {index.next_step}{" "}
                  </Typography>
                  {index?.prospects && index?.prospects.length > 0 && (
                    <Typography
                      onClick={(event) =>
                        index?.prospects?.length > 0 &&
                        clickProspect(index?.prospects, event)
                      }
                      component="span"
                      style={{
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      {index?.prospects?.length}
                      {index?.prospects?.length > 1
                        ? " prospects"
                        : " prospect"}
                    </Typography>
                  )}
                  <Typography
                    onClick={() => functionAddone(index.id)}
                    component="span"
                    sx={{
                      textDecoration: "underline",
                      marginLeft: "20px",
                      cursor: "pointer",
                    }}
                  >
                    Add Prospect
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
                        index?.commentaire ? returnVue(index?.commentaire) : 0
                      }
                      color="primary"
                    >
                      <Typography
                        onClick={(event) => clickCommentaire(index, event)}
                        sx={{
                          marginLeft: "20px",
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        component="span"
                      >
                        <IconMessage fontSize="small" />{" "}
                        <span style={{ marginLeft: "5px" }}>Comment</span>
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
      {dataedit && (
        <Popup open={openform} setOpen={setOpenForm} title="Project">
          <FormProjet dataedit={dataedit} />
        </Popup>
      )}
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
