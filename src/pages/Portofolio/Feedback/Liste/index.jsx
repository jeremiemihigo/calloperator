import {
  Autocomplete,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Input from "components/Input";
import React from "react";
import { useSelector } from "react-redux";
import { config, portofolio } from "static/Lien";
import { ContextFeedback } from "../Context";
import "./liste.css";

function Index() {
  const statut = ["Unreachable", "Pending", "Reachable", "Remind"];
  const status = ["late", "default", "normal"];
  const [statu, setStatus] = React.useState("Overall");
  const [etat, setEtat] = React.useState("Overall");
  const [shopselect, setShopSelect] = React.useState([]);
  const [load, setLoad] = React.useState(false);

  const projet = useSelector((state) => state.projet.projet);
  const { projetSelect, setChecked, client, setClient, data, setData } =
    React.useContext(ContextFeedback);
  const fetchData = async () => {
    try {
      setLoad(true);
      setData([]);
      let fetc =
        etat === "Overall"
          ? ["Unreachable", "Pending", "Reachable", "Remind"]
          : [etat];
      let sta = statu === "Overall" ? ["late", "default", "normal"] : [statu];
      const response = await axios.post(
        portofolio + "/client",
        {
          etat,
          filter: {
            shop: {
              $in: shopselect.map((index) => {
                return index.shop;
              }),
            },
            status: { $in: sta },
            idProjet: projetSelect,
            etat: { $in: fetc },
          },
        },
        config
      );
      if (response.status === 200) {
        setData(response.data);
        setLoad(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    if (shopselect !== "" && projetSelect !== "") {
      fetchData();
    }
  }, [shopselect, projetSelect, etat, statu]);
  const shop = useSelector((state) => state.shop.shop);
  const [show, setShow] = React.useState(true);
  const [value, setValue] = React.useState("");

  const [filterFn, setFilterFn] = React.useState({
    fn: (items) => {
      return items;
    },
  });
  React.useEffect(() => {
    setFilterFn({
      fn: (items) => {
        if (value === "") {
          return items;
        } else {
          return items.filter(
            (x) =>
              x.customer_name.toUpperCase().includes(value.toUpperCase()) ||
              x.codeclient.toUpperCase().includes(value.toUpperCase())
          );
        }
      },
    });
  }, [value]);

  return (
    <div className="feedback_liste">
      {!show && (
        <Card
          onClick={() => setShow(true)}
          sx={{ padding: "4px", marginBottom: "5px", cursor: "pointer" }}
        >
          <Typography sx={{ fontSize: "12px" }}>
            Show filter ------{" "}
            {data.length > 1
              ? data.length + " clients trouvés "
              : data.length + " client trouvé "}
          </Typography>
        </Card>
      )}
      {shop && projet && show && (
        <Card sx={{ padding: "4px", marginBottom: "10px" }}>
          <div className="select__" style={{ marginBottom: "10px" }}>
            <Typography
              onClick={() => setShow(false)}
              sx={{
                width: "100%",
                fontSize: "12px",
                fontWeight: "bolder",
                cursor: "pointer",
                color: "blue",
                textAlign: "right",
              }}
            >
              Reduce filter
            </Typography>
          </div>
          <Stack spacing={3} sx={{ width: "100%", marginBottom: "10px" }}>
            <Autocomplete
              multiple
              value={shopselect}
              disabled={load}
              id="tags-outlined"
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  setShopSelect({
                    title: newValue,
                  });
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  setShopSelect({
                    title: newValue.inputValue,
                  });
                } else {
                  setShopSelect(newValue);
                }
              }}
              options={shop}
              getOptionLabel={(option) => option.shop}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Shop"
                  placeholder="Select a shop"
                />
              )}
            />
          </Stack>
          <div className="select__">
            <select
              style={{ width: "50%", padding: "5px", border: "none" }}
              onChange={(event) => setEtat(event.target.value)}
              value={etat}
            >
              <option value="Overall">Overall</option>
              {!load &&
                statut.map((index) => {
                  return (
                    <option value={index} key={index}>
                      {index}
                    </option>
                  );
                })}
            </select>
            <select
              style={{ width: "50%", padding: "5px", border: "none" }}
              onChange={(event) => setStatus(event.target.value)}
              value={statu}
            >
              <option value="Overall">Overall</option>
              {!load &&
                status.map((index) => {
                  return (
                    <option value={index} key={index}>
                      {index}
                    </option>
                  );
                })}
            </select>
          </div>

          <Typography
            noWrap
            style={{
              padding: "0px",
              fontSize: "12px",
              margin: "0px",
              color: "rgb(0, 169, 254)",
              fontWeight: "bolder",
            }}
          >
            {data.length > 1
              ? data.length + " clients trouvés "
              : data.length + " client trouvé "}
          </Typography>
        </Card>
      )}
      {data.length > 0 && (
        <Card sx={{ padding: "5px", marginBottom: "5px" }}>
          <Input
            label="Customer id or custumer name"
            setValue={setValue}
            value={value}
            showIcon={true}
          />
        </Card>
      )}
      <div>
        {load && (
          <p
            style={{
              textAlign: "center",
              fontSize: "12px",
              fontWeight: "bolder",
              color: "blue",
            }}
            className="f_item"
          >
            Loading...
          </p>
        )}
        {!load &&
          data.length > 0 &&
          filterFn.fn(data).map((index) => {
            return (
              <Grid
                className={
                  client && client._id === index._id
                    ? "client_select f_item"
                    : "f_item"
                }
                onClick={() => {
                  setChecked("");
                  setClient(index);
                }}
                key={index._id}
              >
                <p className="customer_id">{index.codeclient}</p>
                <Typography noWrap component="p" className="customer_name">
                  {index.customer_name.toUpperCase()}
                </Typography>
                <p className="customer_shop">
                  <span>{index.shop}</span>
                  <span className={index.etat}>{index.etat}</span>
                </p>
              </Grid>
            );
          })}
      </div>
    </div>
  );
}

export default Index;
