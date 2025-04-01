import { Delete } from "@mui/icons-material";
import { Alert, Typography } from "@mui/material";
import axios from "axios";
import NoCustomer from "components/Attente";
import LoaderGif from "components/LoaderGif";
import React from "react";
import { config, portofolio } from "static/Lien";

function SavePayment() {
  const [data, setData] = React.useState();
  const [load, setLoad] = React.useState(true);
  const [message, setMessage] = React.useState({ message: "", type: "" });
  const loading = async () => {
    try {
      setMessage({ message: "", type: "" });
      setLoad(true);
      const response = await axios.get(`${portofolio}/readData`, config);
      if (response.status === 200) {
        setData(response.data);
        setLoad(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, []);
  const sendData = async (event) => {
    event.preventDefault();
    setLoad(true);
    try {
      const response = await axios.post(
        `${portofolio}/acceptDataPayement`,
        { data },
        config
      );
      if (response.status === 200) {
        setMessage({ message: "Opération effectuée", type: "success" });
        setData();
        setLoad(false);
      } else {
        setMessage({ message: "" + response.data, type: "warning" });
        setLoad(false);
      }
    } catch (error) {
      setMessage({ message: error.message, type: "warning" });
      setLoad(false);
    }
  };
  return (
    <div>
      {message.message !== "" && (
        <Alert variant="filled" severity={message.type}>
          {message.message}
        </Alert>
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
                  <td>${index.amount}</td>
                  <td>${index.dailyrate}</td>
                  <td>{index.days}</td>
                  <td>{index.par}</td>
                  <td>{index.activation ? "Reactivation" : "No Action"}</td>
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
      {load && <LoaderGif />}
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
          Envoyer
        </Typography>
      )}
    </div>
  );
}

export default SavePayment;
