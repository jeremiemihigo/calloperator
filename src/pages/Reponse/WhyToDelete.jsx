import { Button } from "@mui/material";
import { message } from "antd";
import axios from "axios";
import AutoComplement from "Control/AutoComplet";
import React from "react";
import { useSelector } from "react-redux";
import { config, lien } from "static/Lien";

function WhyToDelete({ id }) {
  const [messageApi, contextHolder] = message.useMessage();
  const feedback = useSelector((state) => state.parametre.parametre);
  const [feedbackSelect, setFeedbackSelect] = React.useState("");
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: texte,
      duration: 5,
    });
  };
  const functDelete = async () => {
    try {
      if (feedbackSelect !== "") {
        const response = await axios.post(
          lien + "/deletedemande",
          {
            message: feedbackSelect?.title,
            id: id.idDemande,
            concerne: feedbackSelect?.concerne
              ? feedbackSelect?.concerne
              : "agent",
          },
          config
        );
        if (response.status === 200) {
          success("Done", "success");
          setFeedbackSelect("");
        } else {
          success("" + response.data, "error");
        }
      }
    } catch (error) {
      success("" + error, "error");
    }
  };
  return (
    <div style={{ width: "20rem" }}>
      {contextHolder}
      <div style={{ marginTop: "10px" }}>
        {feedback &&
          feedback[0]?.feedbackvm &&
          feedback[0]?.feedbackvm.length > 0 && (
            <AutoComplement
              value={feedbackSelect}
              setValue={setFeedbackSelect}
              title="Raison"
              propr="title"
              options={feedback[0]?.feedbackvm}
            />
          )}
      </div>
      <div style={{ marginTop: "10px" }}>
        <Button
          fullWidth
          onClick={() => functDelete()}
          variant="contained"
          color="primary"
        >
          Valider
        </Button>
      </div>
    </div>
  );
}

export default WhyToDelete;
