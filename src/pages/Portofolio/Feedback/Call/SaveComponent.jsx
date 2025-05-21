import { Delete, Save } from "@mui/icons-material";
import { Button, Grid } from "@mui/material";
import { message } from "antd";
import axios from "axios";
import SimpleBackdrop from "Control/Backdrop";
import React from "react";
import { config, portofolio } from "static/Lien";
import { ContextFeedback } from "../Context";

function SaveComponent({ donner }) {
  const [sending, setSending] = React.useState(false);
  const { setChecked, analyse, setAnalyse, client, setClient, setData, data } =
    React.useContext(ContextFeedback);

  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte) => {
    navigator.clipboard.writeText(texte);
    messageApi.open({
      type: "warning",
      content: "warning : " + texte,
      duration: 2,
    });
  };

  const sendData = async () => {
    try {
      setSending(true);

      const { codeclient, idProjet, region, shop, status } = client;
      const {
        feedback,
        type,
        date_to_recall,
        unreachable_feedback,
        contact,
        fonctionne,
        toutvabien,
      } = donner;
      const { sinon, sioui } = feedback;
      if (
        type === "Reachable" &&
        (fonctionne === "" ||
          (fonctionne === "OUI" &&
            ((toutvabien?.idFeedback === "autre" && sioui.texte === "") ||
              toutvabien === "" ||
              sioui.date === "")) ||
          (fonctionne === "NON" && (sinon.texte === "" || sinon.date === "")))
      ) {
        success("Please fill in the fields marked with an asterisk.");
        setSending(false);
      } else {
        let resultat = {
          sioui_texte:
            toutvabien?.idFeedback === "autre"
              ? sioui.texte
              : toutvabien?.idFeedback,
          sioui_date: sioui.date,
          sinon_date: sinon.date,
          sinon_texte: sinon.texte,
          fonctionne,
          codeclient,
          date_to_recall,
          unreachable_feedback,
          contact,
          idProjet,
          shop,
          region,
          type,
          status,
        };
        const response = await axios.post(
          portofolio + "/addFeedback",
          resultat,
          config
        );
        setSending(false);
        if (response.status === 200) {
          setData(
            data.filter((x) => x.codeclient !== response.data.codeclient)
          );
          setAnalyse([...analyse, response.data]);
          setChecked("");
          setClient("");
        } else {
          success("" + response.data);
          setSending(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const annuler = () => {
    setChecked("");
    setClient("");
  };

  return (
    <>
      {contextHolder}
      <SimpleBackdrop open={sending} title="Please wait..." taille="10rem" />
      <Grid container>
        <Grid item lg={6} sx={{ padding: "10px" }}>
          <Button
            disabled={sending}
            onClick={() => sendData()}
            fullWidth
            variant="contained"
            color="primary"
          >
            <Save fontSize="small" />{" "}
            <span style={{ marginLeft: "5px" }}>Valider</span>
          </Button>
        </Grid>
        <Grid item lg={6} sx={{ padding: "10px" }}>
          <Button
            onClick={() => annuler()}
            fullWidth
            variant="contained"
            color="warning"
          >
            <Delete fontSize="small" />{" "}
            <span style={{ marginLeft: "5px" }}>Annuler</span>
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default SaveComponent;
