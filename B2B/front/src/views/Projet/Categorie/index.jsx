import { Tooltip, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import Popup from "src/static/Popup";
import { config, lien } from "../../../static/Lien";
import { ContexteProjet } from "../Context";
import Ajouter from "./Ajouter";
import "./categorie.style.css";

function CategorieIndex() {
  const [open, setOpen] = React.useState(false);
  const categorie = useSelector((state) => state.categorie.categorie);
  const { setProjetListe, setState } = React.useContext(ContexteProjet);

  const loadingProjet = async (index) => {
    try {
      setState({ titre: index, etat: true });
      const response = await axios.post(
        `${lien}/readProjet`,
        { data: { idCategorie: index.id } },
        config
      );
      if (response.status === 200) {
        setProjetListe(response.data);
        setState({ titre: index, etat: false });
      }
    } catch (error) {
      setState({ titre: index, etat: false });
      console.log(error);
    }
  };

  return (
    <>
      <Grid className="title_categorie" onClick={() => setOpen(true)}>
        <Typography component="p" noWrap>
          Ajouter une catégorie
        </Typography>
      </Grid>
      {categorie &&
        categorie.length > 0 &&
        categorie.map((index) => {
          return (
            <Grid
              onClick={() => loadingProjet(index)}
              className="item_categorie"
              key={index._id}
            >
              <Tooltip title={index.title}>
                <Typography component="p" noWrap>
                  {index.title}
                </Typography>
              </Tooltip>
            </Grid>
          );
        })}
      <Popup open={open} setOpen={setOpen} title="Ajouter une catégorie">
        <Ajouter />
      </Popup>
    </>
  );
}

export default CategorieIndex;
