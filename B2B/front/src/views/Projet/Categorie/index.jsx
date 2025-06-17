import { Delete, Edit } from "@mui/icons-material";
import { Paper, Tooltip, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteCategorie } from "src/Redux/categorisation";
import { config, lien } from "src/static/Lien";
import Popup from "src/static/Popup";
import DirectionSnackbar from "src/static/SnackBar";
import { ContexteProjet } from "../Context";
import Ajouter from "./Ajouter";
import "./categorie.style.css";

function CategorieIndex() {
  const [open, setOpen] = React.useState(false);
  const categorie = useSelector((state) => state.categorie);
  const { setProjetListe, setState, state } = React.useContext(ContexteProjet);
  const [datachange, setDataChange] = React.useState();

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
  const dispatch = useDispatch();
  const deletecategorie = (id) => {
    try {
      dispatch(DeleteCategorie({ id }));
    } catch (error) {
      console.log(error);
    }
  };

  if (categorie?.categorie === "token_expired") {
    localStorage.removeItem("auth");
    window.location.replace("/auth/login");
  } else {
    return (
      <Paper sx={{ height: "100%", padding: "5px" }}>
        {categorie.deletecategorie === "rejected" && (
          <DirectionSnackbar message={categorie.deletecategorieError} />
        )}
        <Grid
          className="title_categorie"
          onClick={() => {
            setDataChange();
            setOpen(true);
          }}
        >
          <Typography component="p" noWrap>
            Nouveau repertoire
          </Typography>
        </Grid>
        <Grid>
          {categorie && categorie?.categorie ? (
            categorie?.categorie.length > 0 &&
            categorie?.categorie.map((index) => {
              return (
                <Grid
                  key={index._id}
                  className={`item_categorie ${
                    state?.titre._id === index._id && "actif"
                  }`}
                >
                  <Tooltip title={index.title}>
                    <Grid
                      className={`folder ${
                        state?.titre._id === index._id && "actif"
                      }`}
                      onClick={() => loadingProjet(index)}
                    >
                      <div className="content">
                        <img src="/folder.png" width={30} height={30} />
                        <Typography noWrap component="p">
                          {index.title}
                        </Typography>
                      </div>
                      <div className="options">
                        <Edit
                          fontSize="small"
                          onClick={() => {
                            setDataChange(index);
                            setOpen(true);
                          }}
                        />
                        <Delete
                          fontSize="small"
                          onClick={() => deletecategorie(index.id)}
                        />
                      </div>
                    </Grid>
                  </Tooltip>
                </Grid>
              );
            })
          ) : (
            <p>Loading...</p>
          )}
        </Grid>

        <Popup open={open} setOpen={setOpen} title="Ajouter une catégorie">
          <Ajouter />
        </Popup>
        {datachange && (
          <Popup open={open} setOpen={setOpen} title="Modifier une catégorie">
            <Ajouter data={datachange} />
          </Popup>
        )}
      </Paper>
    );
  }
}

export default CategorieIndex;
