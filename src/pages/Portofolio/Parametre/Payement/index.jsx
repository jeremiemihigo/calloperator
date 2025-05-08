import { CircularProgress, Grid, Typography } from "@mui/material";
import axios from "axios";
import SimpleBackdrop from "Control/Backdrop";
import DirectionSnackbar from "Control/SnackBar";
import React from "react";
import { config, portofolio } from "static/Lien";
import * as xlsx from "xlsx";
import PayementUpload from "../Data/Payement";

function Action() {
  const [data, setData] = React.useState();
  const [sending, setSending] = React.useState(false);

  const [message, setMessage] = React.useState("");

  const readUploadFile = (e) => {
    e.preventDefault();
    setSending(true);
    setMessage("");
    try {
      if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = xlsx.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = xlsx.utils.sheet_to_json(worksheet);
          setData(json);
          setSending(false);
          setMessage("");
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      }
    } catch (error) {
      alert("Error " + error);
    }
  };
  const uploadCustomer = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const response = await axios.post(
        `${portofolio}/payement`,
        { data },
        config
      );
      if (response.status === 200) {
        setMessage(`${response.data.length} payement saved`);
        setData();
        setSending(false);
      } else {
        setMessage("" + response?.data);
        setSending(false);
      }
    } catch (error) {
      setMessage("" + error);
      setSending(false);
    }
  };

  return (
    <>
      {message !== "" && <DirectionSnackbar message={message} />}
      <SimpleBackdrop open={sending} title="Please wait..." taille="10rem" />
      {!sending && (
        <Grid item lg={3} xs={12} sm={6} md={6} sx={{ paddingLeft: "10px" }}>
          <input
            type="file"
            id="actual-btn"
            accept=".xlsx"
            hidden
            onChange={(e) => readUploadFile(e)}
          />
          <label className="label" htmlFor="actual-btn">
            Cliquez ici pour télécharger le fichier.
          </label>
        </Grid>
      )}

      {data && !sending && data.length > 0 && (
        <Typography
          onClick={(e) => uploadCustomer(e)}
          sx={{
            fontSize: "12px",
            cursor: "pointer",
            marginTop: "10px",
            textAlign: "right",
            color: "blue",
          }}
        >
          Cliquez ici pour enregistrer
        </Typography>
      )}
      {sending && !data && (
        <div
          style={{ display: "flex", justifyContent: "right", margin: "10px" }}
        >
          {" "}
          <CircularProgress size={15} />
        </div>
      )}
      {!data && <PayementUpload />}
    </>
  );
}

export default Action;
