import { Search } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import AutoComplement from "Control/AutoComplet";
import DirectionSnackbar from "Control/SnackBar";
import { Input } from "antd";
import axios from "axios";
import _ from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import ExcelButton from "static/ExcelButton";
import { big_data, config, dateFrancais, dayDiff } from "static/Lien";
import Selected from "static/Select";
import Analyse from "./Analyse";
import { generateNomFile } from "./NameFile";
import Plaintes from "./Plaintes";
import StatistiqueCO from "./StatistiqueCO";
import "./style.css";

function Rapport() {
  const [dates, setDates] = React.useState({ debut: "", fin: "" });
  const [donnerFound, setDonnerFound] = React.useState([]);
  const [samplejson2, setSample] = React.useState();
  const [nomFile, setNomFile] = React.useState("");
  const feedbacks = useSelector((state) => state.feedback.feedback);
  const returnFeedback = (id) => {
    if (_.filter(feedbacks, { idFeedback: id }).length > 0) {
      return _.filter(feedbacks, { idFeedback: id })[0].title;
    } else {
      return id;
    }
  };

  const select = [
    { id: 1, title: "Shop", value: "idShop" },
    { id: 2, title: "Region", value: "idZone" },
    { id: 3, title: "Overall", value: "overall" },
  ];
  const [valueSelect, setValueSelect] = React.useState("");

  const region = useSelector((state) => state.zone?.zone);
  const [idShop, setValeurShop] = React.useState("");
  const [idZone, setValeurRegion] = React.useState("");

  const chekValue = (value) => {
    if (value === "null" || value === "undefined" || !value) {
      return "";
    } else {
      return value;
    }
  };
  const retourDate = (date) => {
    return `${date.split("T")[0]}`;
  };

  const [loading, setLoading] = React.useState(false);

  const returnTime = (date1, date2) => {
    let resultat =
      (new Date(date2.createdAt).getTime() -
        new Date(date1.updatedAt).getTime()) /
      60000;
    if (resultat < 1) {
      return 1;
    } else {
      return resultat;
    }
  };
  // const [temps, setTemps] = React.useState(0);
  const shop = useSelector((state) => state.shop?.shop);
  const zone = useSelector((state) => state.zone?.zone);

  const returnShopRegion = (code, status) => {
    if (status === "zone") {
      return _.filter(zone, { idZone: code })[0].denomination;
    } else {
      return _.filter(shop, { idShop: code })[0]?.shop;
    }
  };
  const retournDateHeure = (valeur) => {
    return `${valeur.split("T")[1].split(":")[0]}:${
      valeur.split("T")[1].split(":")[1]
    }`;
  };
  const returnFonction = (a) => {
    if (a === "tech") {
      return "TECH";
    }
    if (a === "agent") {
      return "SA";
    }
    if (!["agent", "tech"].includes(a)) {
      return a;
    }
  };
  const [message, setMessage] = React.useState();
  const searchData = async () => {
    try {
      if (dayDiff(dates.debut, dates.fin) > 31) {
        setMessage("Les jours ne doivent pas aller au delà de 31");
      } else {
        if (valueSelect === "" || dates.debut === "" || dates.fin === "") {
          setMessage("Veuillez renseigner les champs");
        } else {
          let recherche = {};
          recherche.key = valueSelect;
          recherche.value =
            valueSelect === "idShop"
              ? idShop?.idShop
              : valueSelect === "idZone" && idZone?.idZone;
          let dataTosearch = {};
          if (recherche.key !== "overall") {
            dataTosearch.key = recherche.key;
            dataTosearch.value = recherche.value;
          }
          let data = {
            debut: dates.debut,
            fin: dates.fin,
            followUp: false,
            dataTosearch,
          };
          setLoading(true);
          const response = await axios.post(
            big_data + "/rapport",
            data,
            config
          );
          if (response.data === "token expired") {
            localStorage.removeItem("auth");
            window.location.replace("/login");
          } else {
            setDonnerFound(response.data);
            let donner = [];
            for (let i = 0; i < response.data.length; i++) {
              donner.push({
                idDemande: response.data[i].idDemande,
                ID: response.data[i].codeclient,

                NOMS: response.data[i].nomClient,
                "SERIAL NUMBER": chekValue(response.data[i].codeCu),
                "CLIENT STATUS": response.data[i].clientStatut,
                "PAYMENT STATUS": response.data[i].PayementStatut,
                "CONS. EXP. DAYS":
                  response.data[i].PayementStatut === "normal"
                    ? 0
                    : Math.abs(response.data[i].consExpDays),
                REGION: returnShopRegion(response.data[i].idZone, "zone"),
                SHOP: returnShopRegion(response.data[i]?.idShop, "shop"),
                "CODE AGENT": response.data[i].demandeur.codeAgent,
                "NOMS DU DEMANDEUR": response.data[i].demandeur.nom,
                Fonction: returnFonction(response.data[i].demandeur.fonction),
                "DATE DE REPONSE": retourDate(response.data[i].dateSave),
                "C.O": response.data[i].agentSave?.nom,
                "STATUT DE LA DEMANDE": response.data[i].demande.typeImage,
                "DATE D'ENVOIE": retourDate(response.data[i].demande.updatedAt),
                "HEURE D'ENVOI": retournDateHeure(
                  response.data[i].demande.updatedAt
                ),
                "HEURE DE REPONSE": retournDateHeure(
                  response.data[i].createdAt
                ),
                "TEMPS MOYEN": `${returnTime(
                  response.data[i].demande,
                  response.data[i]
                ).toFixed(0)}`,
                LONGITUDE: chekValue(response.data[i].coordonnee?.longitude),
                LATITUDE: chekValue(response.data[i].coordonnee?.latitude),
                ALTITUDE: chekValue(response.data[i].coordonnee?.altitude),
                "ETAT PHYSIQUE":
                  response.data[i].demande?.statut === "allumer"
                    ? "allumé"
                    : "eteint",
                RAISON: returnFeedback(response.data[i]?.raison),
                Item_Swap: response.data[i].demande?.itemswap,
                COMMUNE: response.data[i].demande?.commune,
                QUARTIER: response.data[i].demande?.sector,
                AVENUE: response.data[i].demande?.cell,
                REFERENCE: response.data[i].demande?.reference,
                SAT: response.data[i].demande?.sat,
                CONTACT:
                  response.data[i].demande?.numero !== "undefined"
                    ? response.data[i].demande?.numero
                    : "",
                Adresse: response.data[i]?.adresschange,
              });
            }
            setLoading(false);
            setSample(donner);
            setNomFile(generateNomFile(dates, "Visite menage"));
          }
        }
      }
    } catch (error) {
      console.log(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  };
  return (
    <Paper sx={{ padding: "5px" }} elevation={3}>
      {message && <DirectionSnackbar message={message} />}
      {shop &&
      shop.length > 0 &&
      feedbacks &&
      feedbacks.length > 0 &&
      zone &&
      zone.length > 0 ? (
        <>
          <div>
            <Grid container>
              <Grid item lg={2} sx={{ padding: "5px" }} sm={3} xs={12} md={3}>
                <Selected
                  label="Filtrer par"
                  data={select}
                  value={valueSelect}
                  setValue={setValueSelect}
                />
              </Grid>

              {region && valueSelect === "idZone" && (
                <Grid item lg={2} sx={{ padding: "5px" }} sm={3} xs={8} md={3}>
                  <AutoComplement
                    value={idZone}
                    setValue={setValeurRegion}
                    options={region}
                    title="Selectionnez la region"
                    propr="denomination"
                  />
                </Grid>
              )}
              {shop && valueSelect === "idShop" && (
                <Grid item lg={2} sm={3} xs={8} md={3} sx={{ padding: "5px" }}>
                  <AutoComplement
                    value={idShop}
                    setValue={setValeurShop}
                    options={shop}
                    title="Shop"
                    propr="shop"
                  />
                </Grid>
              )}

              <Grid item lg={2} sm={4} xs={6} md={3} sx={{ padding: "5px" }}>
                <Input
                  type="date"
                  onChange={(e) =>
                    setDates({
                      ...dates,
                      debut: e.target.value,
                    })
                  }
                  placeholder="Date"
                />
              </Grid>
              <Grid item lg={2} sm={4} xs={6} md={3} sx={{ padding: "5px" }}>
                <Input
                  onChange={(e) =>
                    setDates({
                      ...dates,
                      fin: e.target.value,
                    })
                  }
                  type="date"
                  placeholder="Date"
                />
              </Grid>
              <Grid item lg={1} sm={2} xs={6} md={3} sx={{ padding: "5px" }}>
                <Button
                  disabled={loading}
                  fullWidth
                  color="primary"
                  variant="contained"
                  onClick={() => searchData()}
                >
                  {loading ? (
                    <CircularProgress size={12} />
                  ) : (
                    <Search fontSize="small" />
                  )}
                </Button>
              </Grid>
              {!loading && (
                <Grid item lg={1} sm={2} md={3} xs={6} sx={{ padding: "5px" }}>
                  <ExcelButton
                    data={samplejson2}
                    title=""
                    fileName={`${nomFile}.xlsx`}
                  />
                </Grid>
              )}
            </Grid>
          </div>
          {donnerFound.length > 0 && (
            <Grid container>
              <Grid item lg={5} sm={5} xs={12}>
                <Plaintes
                  data={samplejson2}
                  loadings={searchData}
                  dates={dates}
                />
              </Grid>
              <Grid item lg={7} sm={7} xs={12}>
                <StatistiqueCO data={donnerFound} />
              </Grid>
              <Grid item lg={12} sm={12} xs={12}>
                <Grid className="pagesTitle">
                  <Typography>
                    Analyse des visites ménages du {dateFrancais(dates.debut)}{" "}
                    au {dateFrancais(dates.fin)}
                  </Typography>
                </Grid>
                <Analyse data={donnerFound} />
              </Grid>
            </Grid>
          )}
        </>
      ) : (
        <>
          <p style={{ textAlign: "center" }}>
            Patientez le Chargement des shops et regions....
          </p>
        </>
      )}
    </Paper>
  );
}

export default Rapport;
