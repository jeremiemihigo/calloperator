import { TextField } from "@mui/material";
import { IconSend } from "@tabler/icons-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { AddCommentaire } from "../../Redux/projet";
import { changeStatusProspect } from "../../Redux/prospect";
import { allstatus } from "../../static/Lien";
import Selected from "../../static/Select";
import DirectionSnackbar from "../../Static/SnackBar";
import Commentaires from "./Commentaires";
import "./style.css";

function CommentaireIndex() {
  const location = useLocation();
  const { state } = location;
  const [data, setData] = React.useState();
  const [statut, setStatut] = React.useState("");
  const navigation = useNavigate();
  React.useEffect(() => {
    if (state) {
      setData(state.data);
      setStatut(state.data.statut ? state.data.statut : "En cours");
    } else {
      navigation("/projets");
    }
  }, [state]);

  const [commentaire, setCommentaire] = React.useState("");
  const dispatch = useDispatch();
  const projet = useSelector((state) => state.projet);
  const sendData = (event) => {
    event.preventDefault();
    try {
      if (commentaire !== "" && state.type === "projet") {
        dispatch(
          AddCommentaire({
            statut,
            commentaire,
            concerne: data?.id,
          })
        );
        setCommentaire("");
      }
      if (commentaire !== "" && state.type === "prospect") {
        dispatch(
          changeStatusProspect({ statut, commentaire, concerne: data?.id })
        );
        setCommentaire("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="chat-container">
      {projet.comment === "rejected" && (
        <DirectionSnackbar message={projet.commentError} />
      )}
      {data && (
        <div className="messages">
          <div>
            <Commentaires data={data} type={state.type} />
          </div>
        </div>
      )}
      <form className="chat-form display">
        <TextField
          name="Commentaire"
          label="Commentaire"
          id="commentaire"
          onChange={(event) => setCommentaire(event.target.value)}
          value={commentaire}
          variant="outlined"
          fullWidth
          multiline
          sx={{
            mt: 2,
            mb: 2,
            minWidth: "20rem",
          }}
        />
        <div style={{ padding: "3px", width: "15%" }}>
          <Selected
            label="Statut"
            data={allstatus}
            value={statut}
            setValue={setStatut}
          />
        </div>
        <div className="formbtn">
          <button onClick={(event) => sendData(event)}>
            <IconSend />
          </button>
        </div>
      </form>
    </div>
  );
}

export default CommentaireIndex;
