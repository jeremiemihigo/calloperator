/* eslint-disable react/prop-types */
import { Edit } from "@mui/icons-material";
import { Button, Grid, TextField } from "@mui/material";
import axios from "axios";
import AutoComplement from "Control/AutoComplet";
import DirectionSnackbar from "Control/SnackBar";
import _ from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { config, portofolio } from "static/Lien";
import Selected from "static/Select";
import "./data.style.css";

function EditUpload({ data }) {
  const [values, setValue] = React.useState({
    codeclient: "",
    customer_name: "",
    dailyrate: "",
    first_number: "",
    monthlyrate: "",
    payment_number: "",
    par: "",
    second_number: "",
    total_paid: "",
    status: "",
    weeklyrate: "",
  });
  const zone = useSelector((state) => state.zone);
  const [parselect, setParselect] = React.useState("");
  const lesPar = [
    { id: 1, title: "PAR 0", value: "PAR 0" },
    { id: 2, title: "PAR 15", value: "PAR 15" },
    { id: 3, title: "PAR 30", value: "PAR 30" },
    { id: 4, title: "PAR 60", value: "PAR 60" },
    { id: 5, title: "PAR 90", value: "PAR 90" },
    { id: 6, title: "PAR 120", value: "PAR 120" },
    { id: 7, title: "NORMAL", value: "NORMAL" },
  ];
  const allstatus = [
    { id: 1, title: "Normal", value: "normal" },
    { id: 2, title: "Late", value: "late" },
    { id: 3, title: "Default", value: "default" },
  ];
  const shops = useSelector((state) => state.shop.shop);
  const [statut, setStatut] = React.useState();
  const [valueRegionSelect, setValueRegionSelect] = React.useState("");
  const [valueShopSelect, setValueShopSelect] = React.useState("");
  // eslint-disable-next-line no-unused-vars
  const {
    codeclient,
    customer_name,
    dailyrate,
    first_number,
    monthlyrate,
    payment_number,
    total_paid,
    par,
    second_number,
    weeklyrate,
  } = values;
  const onChange = (e) => {
    const { name, value } = e.target;
    setValue({
      ...values,
      [name]: value,
    });
  };
  React.useEffect(() => {
    if (data) {
      setValue({ ...data });
      let select = _.filter(zone.zone, { denomination: data.region });
      setValueRegionSelect(select[0]);
      setValueShopSelect(_.filter(shops, { shop: data.shop })[0]);
      setStatut(allstatus.filter((x) => x.value === data.status)[0].value);
      setParselect(lesPar.filter((x) => x.value === data.par)[0]?.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const agent = useSelector((state) => state.agent);
  const [message, setMessage] = React.useState("");

  const sendUpdate = async () => {
    if (!statut || valueRegionSelect?.idZone !== valueShopSelect?.idZone) {
      setMessage("Verifie si le shop appartient dans la region sélectionnée");
    } else {
      const donner = {
        codeclient,
        customer_name,
        dailyrate,
        total_paid,
        first_number,
        monthlyrate,
        payment_number,
        par,
        second_number,
        weeklyrate,
        status: statut,
        shop: valueShopSelect?.shop,
        region: valueRegionSelect?.denomination,
      };
      const response = await axios.post(
        `${portofolio}/editoneupload`,
        { data: donner, id: data.id },
        config
      );
      if (response.status === 200) {
        setMessage("Done");
      } else {
        setMessage("" + response.data);
      }
    }
  };
  return (
    <Grid container style={{ padding: "10px", width: "23rem" }}>
      {message && <DirectionSnackbar message={message} />}
      <Grid item lg={6} className="childcomposant">
        <div>
          <TextField
            onChange={onChange}
            value={codeclient}
            label="Code client"
            name="codeclient"
            autoComplete="off"
            fullWidth
          />
        </div>
        <div>
          <TextField
            className="textField"
            onChange={onChange}
            value={customer_name}
            label="customer_name"
            name="customer_name"
            autoComplete="on"
            fullWidth
          />
        </div>
        <div>
          <TextField
            className="textField"
            onChange={onChange}
            value={dailyrate}
            label="dailyrate"
            name="dailyrate"
            autoComplete="off"
            fullWidth
          />
        </div>
        <div>
          <TextField
            className="textField"
            onChange={onChange}
            value={weeklyrate}
            label="weeklyrate"
            name="weeklyrate"
            autoComplete="off"
            fullWidth
          />
        </div>
        <div>
          <TextField
            className="textField"
            onChange={onChange}
            value={monthlyrate}
            label="monthlyrate"
            name="monthlyrate"
            autoComplete="off"
            fullWidth
          />
        </div>
        <div>
          <TextField
            className="textField"
            onChange={onChange}
            value={total_paid}
            label="Total_paid_to_date"
            name="total_paid"
            autoComplete="off"
            fullWidth
          />
        </div>
        <div>
          <TextField
            className="textField"
            onChange={onChange}
            value={first_number}
            label="first_number"
            name="first_number"
            autoComplete="off"
            fullWidth
          />
        </div>
      </Grid>
      <Grid item lg={6} className="childcomposant">
        <div>
          <TextField
            className="textField"
            onChange={onChange}
            value={second_number}
            label="second_number"
            name="second_number"
            autoComplete="off"
            fullWidth
          />
        </div>
        <div>
          <TextField
            className="textField"
            onChange={onChange}
            value={payment_number}
            label="payment_number"
            name="payment_number"
            autoComplete="off"
            fullWidth
          />
        </div>
        <div>
          <Selected
            label="Par"
            data={lesPar}
            value={parselect}
            setValue={setParselect}
          />
        </div>
        <div>
          <Selected
            label="Statut"
            data={allstatus}
            value={statut}
            setValue={setStatut}
          />
        </div>

        <div>
          {zone && zone.zone.length > 0 && (
            <AutoComplement
              value={valueRegionSelect}
              setValue={setValueRegionSelect}
              options={zone?.zone}
              title={zone && zone.zone.length < 1 ? "Loading..." : "Regions"}
              propr="denomination"
            />
          )}
        </div>
        <div>
          {valueRegionSelect !== "" && valueRegionSelect !== null && (
            <AutoComplement
              value={valueShopSelect}
              setValue={setValueShopSelect}
              options={valueRegionSelect && valueRegionSelect.shop}
              title="Shop"
              propr="shop"
            />
          )}
        </div>
      </Grid>

      <Button
        fullWidth
        variant="contained"
        disabled={
          zone.addZone === "pending" || agent.updateAgent == "pending"
            ? true
            : false
        }
        style={{ marginTop: "15px" }}
        onClick={(e) => sendUpdate(e)}
      >
        <Edit fontSize="small" />
        <span>Modifier</span>
      </Button>
    </Grid>
  );
}

export default EditUpload;
