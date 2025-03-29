import { Delete } from "@mui/icons-material";
import { CircularProgress, Grid, Typography } from "@mui/material";
import axios from "axios";
import SimpleBackdrop from "Control/Backdrop";
import DirectionSnackbar from "Control/SnackBar";
import React from "react";
import { config, lien_dt } from "static/Lien";
import * as xlsx from "xlsx";

function Action() {
  const [data, setData] = React.useState();
  const [sending, setSending] = React.useState(false);
  const column = ["codeclient", "shop", "region", "action", "statut"];

  const [message, setMessage] = React.useState(false);

  const readUploadFile = (e) => {
    e.preventDefault();
    setSending(true);
    try {
      if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = xlsx.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = xlsx.utils.sheet_to_json(worksheet);
          const cleFile = Object.keys(json[0]);
          let nexistepas = column.filter((x) => !cleFile.includes(x));
          let vrai = json.map((x) => {
            return {
              codeclient: x.codeclient.trim(),
              region: x.region,
              shop: x.shop,
              statut: x.statut,
              par: x.par,
              action: x.action,
              plateforme: "callcenter",
            };
          });
          if (
            vrai.filter(
              (x) => !x.codeclient || !x.region || !x.shop || !x.statut
            ).length > 0
          ) {
            setMessage("Le champs ayant l'asterisque ne doit pas etre vide");
            setSending(false);
          } else if (nexistepas.length > 0) {
            setMessage(`Erreur sur la colonne ${nexistepas.join("")}`);
            setSending(false);
          } else {
            setData(vrai);
            setSending(false);
          }
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
        lien_dt + "/change_action_excel",
        { data },
        config
      );
      if (response.status === 200) {
        setMessage(response.data);
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
      {message && <DirectionSnackbar message={message} />}
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
      <div className="p_contain">
        <p>Le fichier doit inclure ces colonnes avec une écriture uniforme</p>
      </div>
      <div className="divTable">
        {data && data.length > 0 && (
          <table>
            <thead>
              <tr>
                <td>#</td>
                <td>codeclient</td>
                <td>region</td>
                <td>shop</td>
                <td>action</td>
                <td>statut</td>
                <td>Delete</td>
              </tr>
            </thead>
            <tbody>
              {data.map((index, key) => {
                return (
                  <tr
                    className={`${!index.status ? "error_code" : "no_error"}`}
                    key={index.id}
                  >
                    <td>{key + 1}</td>
                    <td>{index.codeclient}</td>
                    <td>{index.region}</td>
                    <td>{index.shop}</td>
                    <td>{index.action}</td>
                    <td>{index.statut}</td>
                    <td>
                      <Delete
                        color="secondary"
                        onClick={() =>
                          setData(
                            data.filter(
                              (x) => x.codeclient !== index.codeclient
                            )
                          )
                        }
                        fontSize="small"
                        sx={{ cursor: "pointer" }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!data && (
          <table>
            <thead>
              <tr>
                <td>codeclient</td>
                <td>region</td>
                <td>shop</td>
                <td>action</td>
                <td>statut</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Code client</td>
                <td>Region</td>
                <td>Shop</td>
                <td>Reactivation; Repossession or Opt-Out</td>
                <td>Pending, Approved or Rejected</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {data && !sending && data.filter((x) => !x.statut).length === 0 && (
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
          Envoyer
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
    </>
  );
}

export default Action;
