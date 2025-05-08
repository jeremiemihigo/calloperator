/* eslint-disable react/prop-types */
import { Send } from "@mui/icons-material";
import { Button, TextField, Typography } from "@mui/material";
import { message } from "antd";
import axios from "axios";
import ConfirmDialog from "Control/ControlDialog";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { config, lien } from "static/Lien";
import Popup from "static/Popup";
import AddFeedback from "./AddFeedback";

function FeedbackComponent({ demande, update }) {
  const [reclamation, setReclamation] = useState("");
  const user = useSelector((state) => state.user?.user);
  const [open, setOpen] = React.useState(false);
  const feedback = useSelector((state) => state.parametre.parametre);
  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const sendReclamation = async () => {
    try {
      setConfirmDialog({
        ...confirmDialog,
        isOpen: false,
      });
      let visite = demande || update;
      const data = {
        _id: visite._id,
        message: reclamation.title,
        concerne: reclamation.concerne ? reclamation.concerne : "agent",
        sender: "co",
        idDemande: visite.idDemande,
        codeAgent: user?.codeAgent,
      };
      setReclamation("");
      const response = await axios.post(lien + "/reclamation", data);
      if (response.status === 200) {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [filterFn, setFilterFn] = React.useState({
    fn: (items) => {
      return items;
    },
  });
  const handleChanges = (e) => {
    let target = e.target.value.toLowerCase();
    setFilterFn({
      fn: (items) => {
        if (target === "") {
          return items;
        } else {
          return items.filter((x) =>
            x.title.toUpperCase().includes(e.target.value.toUpperCase())
          );
        }
      },
    });
  };
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    navigator.clipboard.writeText(texte);
    messageApi.open({
      type: "" + type,
      content: "" + texte,
      duration: 2,
    });
  };
  const suppression = async (id) => {
    try {
      const response = await axios.post(
        lien + "/deleteOneItem",
        { id },
        config
      );
      if (response.status === 200) {
        success("Opération effectuée", "success");
      } else {
        success("Error " + response.data, "warning");
      }
    } catch (error) {
      success("Error " + error, "warning");
    }
  };
  return (
    <>
      {contextHolder}
      {user && user.fonction === "superUser" && (
        <Typography
          component="p"
          sx={{
            fontSize: "12px",
            cursor: "pointer",
            color: "blue",
            fontWeight: 800,
          }}
          onClick={() => setOpen(true)}
        >
          Add feedback
        </Typography>
      )}

      <div>
        <>
          <TextField
            onChange={(e) => handleChanges(e)}
            style={{ marginTop: "10px" }}
            name="filter"
            autoComplete="off"
            fullWidth
            label="Filter feedback"
          />
        </>
        <div>
          <table>
            <thead>
              <tr>
                <td style={{ textAlign: "center" }}>Feedback</td>
              </tr>
            </thead>
            <tbody>
              {feedback &&
                feedback[0]?.feedbackvm &&
                feedback[0]?.feedbackvm.length > 0 &&
                filterFn.fn(feedback[0]?.feedbackvm).map((index) => {
                  return (
                    <tr
                      style={{
                        backgroundColor: `${
                          index.title === reclamation?.title
                            ? "#dedede"
                            : "#fff"
                        }`,
                      }}
                      onClick={() => setReclamation(index)}
                      key={index._id}
                    >
                      <td>
                        <Typography
                          component="p"
                          sx={{ fontSize: "12px", cursor: "pointer" }}
                        >
                          {index.title}{" "}
                          <span style={{ fontWeight: "bolder" }}>
                            {index.concerne ? index.concerne : "agent"}
                          </span>
                        </Typography>
                        {user && user.fonction === "superUser" && (
                          <Typography
                            onClick={() => suppression(index._id)}
                            component="span"
                            style={{
                              color: "red",
                              cursor: "pointer",
                              fontSize: "10px",
                              fontWeight: "bolder",
                              marginLeft: "5px",
                            }}
                          >
                            Delete
                          </Typography>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div>
          <Button
            onClick={() => {
              setConfirmDialog({
                isOpen: true,
                title:
                  "Souhaitez-vous transmettre ce feedback à l'agent concerné ?",
                subTitle: "Cliquez sur YES pour valider l'operation",
                onConfirm: () => {
                  sendReclamation();
                },
              });
            }}
            color="primary"
            variant="contained"
            fullWidth
            disabled={reclamation === "" ? true : false}
          >
            <Send fontSize="small" />{" "}
            <span style={{ marginLeft: "10px" }}>Envoyer</span>
          </Button>
        </div>
      </div>
      <Popup open={open} setOpen={setOpen} title="Add feedback">
        <AddFeedback />
      </Popup>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}
export default React.memo(FeedbackComponent);
