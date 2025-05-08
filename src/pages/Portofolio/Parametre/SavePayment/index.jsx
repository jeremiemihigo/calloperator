import { Delete } from "@mui/icons-material";
import { Typography } from "@mui/material";
import axios from "axios";
import NoCustomer from "components/Attente";
import LoadingImage from "Control/Loading";
import DirectionSnackbar from "Control/SnackBar";
import React from "react";
import ExcelButton from "static/ExcelButton";
import { config, portofolio, tronquerDecimales } from "static/Lien";

function SavePayment() {
  const [data, setData] = React.useState();
  const [load, setLoad] = React.useState(true);
  const [message, setMessage] = React.useState("");
  const loading = async () => {
    try {
      setMessage("");
      setLoad(true);
      const response = await axios.get(`${portofolio}/readData`, config);
      if (response.status === 200) {
        setData(response.data);
        setLoad(false);
      } else {
        setLoad(false);
      }
    } catch (error) {
      setMessage(error.message);
      setLoad(false);

      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, []);
  const sendData = async (event) => {
    event.preventDefault();
    setLoad(true);
    setMessage("");
    try {
      const response = await axios.post(
        `${portofolio}/acceptDataPayement`,
        { data },
        config
      );
      if (response.status === 200) {
        setMessage("Opération effectuée");
        setData();
        setLoad(false);
      } else {
        setMessage(response.data);
        setLoad(false);
      }
    } catch (error) {
      setMessage(error.message);
      setLoad(false);
    }
  };

  return (
    <div>
      {message && <DirectionSnackbar message={message} />}
      {data && data.length > 0 && !load && (
        <div style={{ width: "20%" }}>
          <ExcelButton
            data={data}
            title="Export to Excel"
            fileName="Payement_to_save.xlsx"
          />
        </div>
      )}
      {data && data.length > 0 && !load && (
        <table>
          <thead>
            <tr>
              <td>#</td>
              <td>account_id</td>
              <td>shop_name</td>
              <td>amount</td>
              <td>Daily rate</td>
              <td>Days</td>
              <td>PAR</td>
              <td>Status</td>
              <td>Delete</td>
            </tr>
          </thead>
          <tbody>
            {data.map((index, key) => {
              return (
                <tr
                  className={`${
                    !index.account_id || !index.amount
                      ? "error_code"
                      : "no_error"
                  }`}
                  key={key}
                >
                  <td>{key + 1}</td>
                  <td>{index.account_id}</td>
                  <td>{index.shop_name}</td>
                  <td>${tronquerDecimales(index.amount)}</td>
                  <td>${index.dailyrate}</td>
                  <td>{index.days}</td>
                  <td>{index.par}</td>
                  <td>
                    {index.activation ? (
                      <p style={{ ...style.label, background: "green" }}>
                        Reactivation
                      </p>
                    ) : (
                      <p style={{ ...style.label, background: "yellow" }}>
                        Isn&apos;t a reactivation
                      </p>
                    )}
                  </td>
                  <td>
                    <Delete
                      color="secondary"
                      onClick={() =>
                        setData(
                          data.filter((x) => x.account_id !== index.account_id)
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
      {data && data.length === 0 && !load && (
        <NoCustomer texte="No Pending action" />
      )}
      {load && <LoadingImage />}
      {data && data.length > 0 && !load && (
        <Typography
          onClick={(e) => sendData(e)}
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
    </div>
  );
}
const style = {
  label: {
    padding: "5px",
    borderRadius: "2px",
    margin: "0px",
    fontWeight: 500,
    width: "100%",
    textAlign: "center",
  },
};
export default SavePayment;
