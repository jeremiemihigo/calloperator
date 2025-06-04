import { Box, TextField, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import { IconMessage } from "@tabler/icons-react";
import moment from "moment";
import React from "react";
import { useLocation, useNavigate } from "react-router";
import { allstatus } from "../../static/Lien";
import Selected from "../../static/Select";
import "../Projet/projet.style.css";

function ListeProspect({ donner }) {
  const location = useLocation();
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

  const clickProjet = (projet) => {
    navigation("/detail_projet", { state: projet });
  };

  return (
    <div>
      <Grid container>
        <Grid item size={{ lg: 6 }} className="display_">
          <TextField
            name="id"
            label="ID Prospect"
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
      <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
        {data &&
          data.length > 0 &&
          data.map((index) => {
            return (
              <Grid
                container
                key={index._id}
                className={returnclasse(index.statut)}
              >
                <Grid item size={{ lg: 10 }} className="projetname">
                  <Typography className="titreprojet" component="p">
                    {index.id} #
                    <Typography
                      component="span"
                      onClick={() => clickProjet(index)}
                    >
                      {index.name}
                    </Typography>
                  </Typography>
                  <Typography className="description">
                    {index.description}
                  </Typography>
                  {index.projet.length > 0 && (
                    <Typography className="next_step" noWrap>
                      <span style={{ fontWeight: "bolder" }}>Projet</span> :{" "}
                      {index.projet[0].designation}
                    </Typography>
                  )}
                  <Typography className="next_step" noWrap>
                    <span style={{ fontWeight: "bolder" }}>Next_step</span> :{" "}
                    {index.next_step}
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
                    {index.statut}
                  </Typography>
                </Grid>
              </Grid>
            );
          })}
      </Box>
    </div>
  );
}

export default ListeProspect;
