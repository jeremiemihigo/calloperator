/* eslint-disable react/prop-types */
import { Edit, Save } from "@mui/icons-material";
import { Button, Grid, TextField } from "@mui/material";
import AutoComplement from "Control/AutoComplet";
import AutoSelectMany from "Control/AutoSelectMany";
import SimpleBackdrop from "Control/Backdrop";
import DirectionSnackbar from "Control/SnackBar";
import { AjouterAgentAdmin, OtherUpdated } from "Redux/AgentAdmin";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Selected from "static/Select";

function AgentAdmin({ agentselect }) {
  const dispatch = useDispatch();
  const roles = useSelector((state) => state.role.role);
  const [initiale, setInitiale] = React.useState({ nom: "", code: "" });
  const [roleSelect, setRole] = React.useState("");
  const [poste, setPoste] = React.useState("");
  const [valuefilter, setValueFilter] = React.useState([]);
  const region = useSelector((state) => state.zone.zone);
  const shop = useSelector((state) => state.shop.shop);

  console.log(valuefilter);
  const fonction = [
    { id: 1, title: "Super utilisateur", value: "superUser" },
    { id: 2, title: "Admin", value: "admin" },
    { id: 3, title: "Call operator", value: "co" },
  ];
  const [fonctionSelect, setFonctionSelect] = React.useState("");

  React.useEffect(() => {
    if (agentselect) {
      setFonctionSelect(agentselect?.fonction);
      setInitiale({ nom: agentselect?.nom, code: agentselect?.codeAgent });
      setValueFilter([]);
      setPoste("");
      setRole("");
    } else {
      setFonctionSelect("");
      setInitiale({ nom: "", code: "" });
      setValueFilter([]);
      setPoste("");
      setRole("");
    }
  }, [agentselect]);
  const admin = useSelector((state) => state.agentAdmin);

  const returnvaluefilter = (v) => {
    if (poste?.filterby === "region") {
      let a = v.map((x) => {
        return x.denomination;
      });
      return a;
    }
    if (poste?.filterby === "shop") {
      let a = v.map((x) => {
        return x.shop;
      });
      return a;
    }
    if (poste?.filterby === "overall") {
      return [];
    }
  };

  const editData = () => {
    try {
      const donner = {
        unset: {},
        data: {
          role: poste ? poste?.idDepartement : agentselect?.role,
          poste: poste ? poste?.id : agentselect?.poste,
          fonction: fonctionSelect,
          nom: initiale.nom,
          valuefilter:
            valuefilter.length > 0
              ? returnvaluefilter(valuefilter)
              : agentselect?.valuefilter,
        },
        idAgent: agentselect._id,
      };
      dispatch(OtherUpdated(donner));
    } catch (error) {
      console.log(error);
    }
  };

  const saveData = () => {
    try {
      const data = {
        nom: values.nom,
        fonction: fonctionSelect,
        codeAgent: values.code,
        role: roleSelect?.idRole,
        poste: poste?.id,
        valuefilter: returnvaluefilter(valuefilter),
      };
      dispatch(AjouterAgentAdmin(data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ width: "25rem", padding: "10px" }}>
      {admin.otherUpdated === "pending" && (
        <SimpleBackdrop open={true} title="Please wait..." />
      )}
      {admin.otherUpdated === "success" && <DirectionSnackbar message="Done" />}
      {admin.otherUpdated === "rejected" && (
        <DirectionSnackbar message={admin.otherUpdatedError} />
      )}
      <TextField
        value={initiale.nom}
        onChange={(event) =>
          setInitiale({
            ...initiale,
            nom: event.target.value,
          })
        }
        label="Name"
        name="title"
        autoComplete="off"
        fullWidth
      />
      <Grid item xs={12} sx={{ margin: "10px 0px" }}>
        <Selected
          label="Fonction"
          data={fonction}
          value={fonctionSelect}
          setValue={setFonctionSelect}
        />
      </Grid>
      <Grid item xs={12}>
        {roles ? (
          <AutoComplement
            value={roleSelect}
            setValue={setRole}
            options={roles}
            title="Selectionnez le departement"
            propr="title"
          />
        ) : (
          <p style={{ textAlign: "center" }}>Loading...</p>
        )}
        {roleSelect && roleSelect?.postes.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <AutoComplement
              value={poste}
              setValue={setPoste}
              options={roleSelect?.postes}
              title="Selectionnez le poste"
              propr="title"
            />
          </div>
        )}
      </Grid>
      {poste && ["region", "shop"].includes(poste.filterby) && (
        <AutoSelectMany
          value={valuefilter}
          setValue={setValueFilter}
          title="Location"
          options={poste.filterby === "region" ? region : shop}
          propr={poste.filterby === "region" ? "denomination" : "shop"}
        />
      )}
      <TextField
        value={initiale.code}
        onChange={(event) =>
          setInitiale({
            ...initiale,
            code: event.target.value,
          })
        }
        disabled={agentselect ? true : false}
        label="Code"
        name="code"
        autoComplete="off"
        sx={{ margin: "10px 0px" }}
        fullWidth
      />
      <Grid item xs={12}>
        <Button
          onClick={agentselect ? () => editData() : () => saveData()}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color={agentselect ? "secondary" : "primary"}
        >
          {agentselect ? <Edit fontSize="small" /> : <Save fontSize="small" />}
          <span style={{ marginLeft: "10px" }}>
            {agentselect ? "Edit" : "Save"}
          </span>
        </Button>
      </Grid>
    </div>
  );
}

export default AgentAdmin;
