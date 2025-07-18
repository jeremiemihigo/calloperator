import { CircularProgress, Grid, Typography } from "@mui/material";
import axios from "axios";
import SimpleBackdrop from "Control/Backdrop";
import DirectionSnackbar from "Control/SnackBar";
import React from "react";
import { config, portofolio } from "static/Lien";
import * as xlsx from "xlsx";
import UploadData from "../Data/Upload";
import "./upload.style.css";

function UploadClient() {
  const [data, setData] = React.useState();
  const [sending, setSending] = React.useState(false);
  const column = [
    "codeclient",
    "customer_name",
    "region",
    "first_number",
    "second_number",
    "total_paid",
    "payment_number",
    "shop",
    "status",
    "par",
    "dailyrate",
    "weeklyrate",
    "monthlyrate",
  ];
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
              codeclient: x.codeclient,
              customer_name: x.customer_name,
              region: x.region,
              shop: x.shop,
              status: x.status,
              par: x.par,
              dailyrate: x.dailyrate,
              weeklyrate: x.weeklyrate,
              monthlyrate: x.monthlyrate,
              total_paid: x.total_paid,
              first_number: x.first_number ? x.first_number : "",
              second_number: x.second_number ? x.second_number : "",
              payment_number: x.payment_number ? x.payment_number : "",
            };
          });
          if (
            vrai.filter(
              (x) =>
                !x.first_number ||
                !x.codeclient ||
                !x.customer_name ||
                !x.region ||
                !x.shop ||
                !x.status
            ).length > 0
          ) {
            console.log(
              vrai.filter(
                (x) =>
                  !x.first_number ||
                  !x.codeclient ||
                  !x.customer_name ||
                  !x.region ||
                  !x.shop ||
                  !x.status
              )
            );
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
        portofolio + "/database",
        { data },
        config
      );
      if (response.status === 200) {
        setMessage(response.data);
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
      <Grid container></Grid>
      {message && <DirectionSnackbar message={message} />}
      {sending && (
        <SimpleBackdrop open={sending} title="Please wait..." taille="10rem" />
      )}
      {!sending && (
        <Grid item lg={3} xs={12} sm={6} md={6} sx={{ margin: "10px" }}>
          <input
            type="file"
            id="actual-btn"
            accept=".xlsx"
            hidden
            onChange={(e) => readUploadFile(e)}
          />
          <label className="label" htmlFor="actual-btn">
            Cliquez ici pour uploader le fichier *
          </label>
        </Grid>
      )}

      <table>
        <thead>
          <tr>
            <td>
              codeclient
              <span
                style={{ color: "red", fontSize: "13px", fontWeight: "bolder" }}
              >
                *
              </span>
            </td>
            <td>
              customer_name{" "}
              <span style={{ color: "red", fontWeight: "bolder" }}>*</span>
            </td>
            <td>
              status
              <span style={{ color: "red", fontWeight: "bolder" }}>*</span>
            </td>
            <td>
              region
              <span style={{ color: "red", fontWeight: "bolder" }}>*</span>
            </td>
            <td>
              shop<span style={{ color: "red", fontWeight: "bolder" }}>*</span>
            </td>
            <td>
              first_number
              <span style={{ color: "red", fontWeight: "bolder" }}>*</span>
            </td>
            <td>second_number</td>
            <td>payment_number</td>
            <td>par</td>
            <td>dailyrate</td>
            <td>weeklyrate</td>
            <td>monthlyrate</td>
            <td>total_paid</td>
          </tr>
        </thead>

        {data && data.length > 0 && (
          <tbody>
            {data.map((index, key) => {
              return (
                <tr key={key}>
                  <td>{index.codeclient}</td>
                  <td>{index.customer_name}</td>
                  <td>{index.status}</td>
                  <td>{index.region}</td>
                  <td>{index.shop}</td>
                  <td>{index.first_number}</td>
                  <td>{index.second_number}</td>
                  <td>{index.payment_number}</td>
                  <td>{index.par}</td>
                  <td>{index.dailyrate}</td>
                  <td>{index.weeklyrate}</td>
                  <td>{index.monthlyrate}</td>
                  <td>{index.total_paid}</td>
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
      {data && !sending && (
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
      {!data && <UploadData />}
    </>
  );
}

export default UploadClient;
