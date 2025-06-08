import { TextField } from "@mui/material";
import { IconSend } from "@tabler/icons-react";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { changeStatusProspect } from "../../Redux/prospect";
import { allstatus, config, lien } from "../../static/Lien";
import Selected from "../../static/Select";
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
  const sendData = async (event) => {
    event.preventDefault();
    try {
      if (commentaire !== "" && state.type === "projet") {
        const response = await axios.post(
          `${lien}/changestatus`,
          {
            statut,
            commentaire,
            concerne: data?.id,
          },
          config
        );
        if (response.status === 200) {
          setData(response.data);
          setStatut(response.data.statut);
          setCommentaire("");
        }
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
  const sendVue = async () => {
    try {
      const response = await axios.get(`${lien}/addvue/${data?.id}`, config);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    sendVue();
  }, [data]);
  return (
    <div className="chat-container">
      {data && (
        <div className="messages">
          <div>
            <Commentaires data={data} type={state.type} />
          </div>
        </div>
      )}
      <form className="chat-form display_">
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
