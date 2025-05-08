/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Search } from "@mui/icons-material";
import { Button, Grid, Paper } from "@mui/material";
import { Input } from "antd";
import axios from "axios";
import MainCard from "components/MainCard";
import AutoComplement from "Control/AutoComplet";
import SimpleBackdrop from "Control/Backdrop";
import RadialBarChart from "pages/Issue/Appel/Dashboard/Chart";
import React from "react";
import { useSelector } from "react-redux";
import { big_data, config } from "static/Lien";
import "../style.css";
import AffichageStat from "./AffichageStat";
import Agents from "./Agents";
import Datastucture from "./Datastucture";
// import Regions from './Regions';

function Statistiques() {
  const region = useSelector((state) => state.zone);
  const [value, setValue] = React.useState("");
  const [shopSelect, setShopSelect] = React.useState("");
  const [dates, setDates] = React.useState({ debut: "", fin: "" });
  const { debut, fin } = dates;

  const [fetch, setFetch] = React.useState(false);
  const [donner, setDonner] = React.useState();

  const sendDataFectch = (e) => {
    e.preventDefault();
    const donner = {
      region: value ? value.idZone : undefined,
      idShop: shopSelect ? shopSelect.idShop : undefined,
    };
    let sended = {};
    if (donner.idShop !== undefined) {
      sended.idShop = donner.idShop;
    }
    if (donner.region !== undefined) {
      sended.codeZone = donner.region;
    }
    setDonner(sended);
  };

  const [listeDemande, setListeDemande] = React.useState();
  const loadingDemandes = async () => {
    setFetch(true);
    try {
      axios
        .post(
          big_data + "/demandeAgentAll",
          { data: donner, debut: debut.split("T")[0], fin: fin.split("T")[0] },
          config
        )
        .then((response) => {
          if (response.data === "token expired") {
            localStorage.removeItem("auth");
            window.location.replace("/login");
          } else {
            setListeDemande(response.data);
            setFetch(false);
          }
        });
    } catch (error) {
      setFetch(false);
      console.log(error);
    }
  };
  React.useEffect(() => {
    if (donner) {
      loadingDemandes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donner]);

  const [donnerStrucuture, setDonneeStructure] = React.useState({
    followup: 0,
    visite: 0,
    attente: 0,
    nconforme: 0,
  });
  const { followup, nconforme, visite, attente } = donnerStrucuture;

  const restructure = () => {
    if (listeDemande) {
      const followups = listeDemande.filter((x) => x.feedback === "followup");
      const visites = listeDemande.filter(
        (x) => x.valide && ["new", "chat"].includes(x.feedback)
      );
      const attentes = listeDemande.filter(
        (x) => x.feedback === "new" && !x.valide
      );
      const confor = listeDemande.filter(
        (x) => !x.valide && x.feedback === "chat"
      );
      setDonneeStructure({
        nconforme: confor.length,
        followup: followups.length,
        visite: visites.length,
        attente: attentes.length,
      });
    }
  };
  React.useEffect(() => {
    restructure();
  }, [listeDemande]);
  const returnNombre = (statut) => {
    if (listeDemande) {
      const valides = listeDemande.filter((x) => x.reponse.length > 0);
      let nombre = valides.filter(
        (x) =>
          x.reponse[0].clientStatut === statut.client &&
          x.reponse[0].PayementStatut === statut.payment
      );

      if (nombre.length > 0) {
        return ((nombre.length * 100) / valides.length).toFixed(0);
      } else {
        return 0;
      }
    }
  };
  const liste = [
    { id: 1, client: "installed", payment: "normal", text: "Normal" },
    { id: 2, client: "installed", payment: "expired", text: "Expired" },
    { id: 3, client: "installed", payment: "defaulted", text: "Defaulted" },
    {
      id: 4,
      client: "pending repossession",
      payment: "defaulted",
      text: "P Repossession",
    },
    {
      id: 5,
      client: "pending activation",
      payment: "pending fulfliment",
      text: "P activation",
    },
    { id: 6, client: "inactive", payment: "terminated", text: "Inactive" },
  ];
  return (
    <>
      <SimpleBackdrop open={fetch} taille="10rem" title="Chargement..." />
      <MainCard>
        <Grid container>
          {region?.zone.length > 0 && (
            <Grid item lg={2} sm={6} xs={12} md={6} sx={{ padding: "5px" }}>
              <AutoComplement
                value={value}
                setValue={setValue}
                options={region.zone}
                title="Régions"
                propr="denomination"
              />
            </Grid>
          )}
          {value && (
            <Grid item lg={2} sm={6} md={6} xs={12} sx={{ padding: "5px" }}>
              <AutoComplement
                value={shopSelect}
                setValue={setShopSelect}
                options={value.shop}
                title="Shop"
                propr="shop"
              />
            </Grid>
          )}

          <Grid
            item
            lg={3}
            sm={6}
            xs={12}
            md={6}
            sx={{ padding: "5px", display: "flex", alignItems: "center" }}
          >
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
          <Grid
            item
            lg={3}
            sm={6}
            xs={12}
            md={6}
            sx={{ padding: "5px", display: "flex", alignItems: "center" }}
          >
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

          <Grid
            item
            lg={2}
            xs={12}
            sx={{ padding: "5px", display: "flex", alignItems: "center" }}
          >
            <Button
              fullWidth
              color="primary"
              variant="contained"
              disabled={fetch}
              onClick={(e) => sendDataFectch(e)}
            >
              <Search fontSize="small" />{" "}
              <span style={{ marginLeft: "5px" }}>
                {fetch ? "Loading..." : "Rechercher"}
              </span>
            </Button>
          </Grid>
        </Grid>
        {listeDemande && (
          <Grid container>
            <Grid item lg={3} xs={12} sx={{ padding: "2px" }} sm={6} md={4}>
              {listeDemande.length > 0 ? (
                <Datastucture
                  subtitle={`Toutes les visites validées soit ${(
                    (visite * 100) /
                    listeDemande.length
                  ).toFixed(0)}%`}
                  title="Visites"
                  nombre={visite}
                />
              ) : (
                <p style={{ textAlign: "center" }}>Loading...</p>
              )}
            </Grid>
            <Grid item lg={3} sx={{ padding: "2px" }} xs={12} sm={6} md={4}>
              <Datastucture
                subtitle="Tous les followup"
                title="Follow up"
                nombre={followup}
              />
            </Grid>
            <Grid item lg={3} sx={{ padding: "2px" }} xs={12} sm={6} md={4}>
              <Datastucture
                subtitle="Toutes les visites en attente"
                title="Attente"
                nombre={attente}
              />
            </Grid>
            <Grid item lg={3} sx={{ padding: "2px" }} xs={12} sm={6} md={4}>
              <Datastucture
                subtitle="En attente de correction"
                title="Non conforme"
                nombre={nconforme}
              />
            </Grid>
          </Grid>
        )}
        {listeDemande && <AffichageStat listeDemande={listeDemande} />}
        <Grid container sx={{ marginTop: "10px" }}>
          {listeDemande &&
            liste.map((index) => {
              return (
                <Grid item lg={2} xs={12} sm={6} md={4} key={index.id}>
                  <Paper elevation={3} sx={{ margin: "2px" }}>
                    <RadialBarChart
                      texte={index.text}
                      nombre={returnNombre(index)}
                    />
                  </Paper>
                </Grid>
              );
            })}
        </Grid>
        {listeDemande && <Agents listeDemande={listeDemande} />}
      </MainCard>
    </>
  );
}

export default Statistiques;
