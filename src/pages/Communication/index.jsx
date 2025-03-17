import { Delete, Edit } from "@mui/icons-material";
import { Grid, Paper, Typography } from "@mui/material";
import ConfirmDialog from "Control/ControlDialog";
import DirectionSnackbar from "Control/SnackBar";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteCommunication } from "Redux/Communication";
import "./communication.style.css";
import FormMessage from "./FormMessage";
import TextWithLineBreaks from "./StructureText";

function Index() {
  const communiquer = useSelector((state) => state.communication);
  const user = useSelector((state) => state.user.user);
  function returnText(date) {
    let nombre = (new Date(date).getTime() - new Date().getTime()) / 86400000;
    if (nombre === 0) {
      return "Ce message expire aujourd'hui";
    }
    if (nombre > 1) {
      return `Ce message expire dans ${nombre.toFixed(0)} jours`;
    }
    if (nombre === 1) {
      return `Ce message expire demain`;
    }
  }

  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const dispatch = useDispatch();
  const DeleteMessage = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    dispatch(DeleteCommunication(id));
  };
  const [dataToUpdate, setDataToUpdate] = React.useState();
  const Update = (d) => {
    setDataToUpdate(d);
  };

  return (
    <>
      {communiquer.addcommunication === "success" && (
        <DirectionSnackbar message="Done" />
      )}
      {communiquer.addcommunication === "rejected" && (
        <DirectionSnackbar message={communiquer.addcommunicationError} />
      )}
      {communiquer.updateCommuniquer === "success" && (
        <DirectionSnackbar message="Done" />
      )}
      {communiquer.updateCommuniquer === "rejected" && (
        <DirectionSnackbar message={communiquer.updateCommuniquerError} />
      )}
      {communiquer.deleteCommuniquer === "success" && (
        <DirectionSnackbar message="Done" />
      )}
      {communiquer.deleteCommuniquer === "rejected" && (
        <DirectionSnackbar message={communiquer.deleteCommuniquerError} />
      )}
      <Grid container>
        {user?.fonction === "superUser" && (
          <Grid item lg={4}>
            <FormMessage
              dataToUpdate={dataToUpdate}
              setDataToUpdate={setDataToUpdate}
            />{" "}
          </Grid>
        )}

        <Grid
          item
          lg={user?.fonction === "superUser" ? 8 : 12}
          sx={{ padding: "5px" }}
        >
          {communiquer?.communication &&
            communiquer.communication.map((index) => {
              return (
                <Paper
                  key={index._id}
                  sx={{ padding: "10px", marginTop: "5px" }}
                >
                  <Typography
                    variant="body"
                    sx={{ textAlign: "center", fontWeight: "bolder" }}
                  >
                    {index.title}
                  </Typography>

                  <TextWithLineBreaks text={index.content} />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ width: "70%" }}>
                      <p
                        style={{
                          fontSize: "10px",
                          margin: "0px",
                          padding: "0px",
                          color: "blue",
                          fontWeight: "bolder",
                        }}
                      >
                        {returnText(index.date)}
                      </p>
                    </div>
                    {user?.fonction === "superUser" && (
                      <div
                        style={{
                          width: "10%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ cursor: "pointer" }}>
                          <Delete
                            color="warining"
                            onClick={() => {
                              setConfirmDialog({
                                isOpen: true,
                                title: "Do you want to delete this message ?",
                                subTitle: "",
                                onConfirm: () => {
                                  DeleteMessage(index._id);
                                },
                              });
                            }}
                            fontSize="small"
                          />
                        </div>
                        <div style={{ cursor: "pointer" }}>
                          <Edit
                            color="primary"
                            onClick={() => Update(index)}
                            fontSize="small"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Paper>
              );
            })}
        </Grid>
      </Grid>

      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}

export default Index;
