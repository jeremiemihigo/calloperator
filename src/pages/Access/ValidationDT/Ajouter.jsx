import { Save } from "@mui/icons-material";
import { Button } from "@mui/material";
import AutoComplement from "Control/AutoComplet";
import { OtherUpdated } from "Redux/AgentAdmin";
import _ from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function PlainteShop() {
  const agentadmin = useSelector((state) =>
    _.filter(state.agentAdmin?.agentAdmin, { active: true })
  );
  const [agentSelect, setAgentSelect] = React.useState("");

  const dispatch = useDispatch();
  const send = (e) => {
    e.preventDefault();
    const data = {
      idAgent: agentSelect?._id,
      data: { validationdt: true },
      unset: {},
    };
    dispatch(OtherUpdated(data));
    setAgentSelect("");
  };
  return (
    <div style={{ width: "22rem" }}>
      {agentadmin && (
        <div style={{ margin: "10px 0px" }}>
          <AutoComplement
            value={agentSelect}
            setValue={setAgentSelect}
            options={agentadmin}
            title="Selectionnez un agent"
            propr="nom"
          />
        </div>
      )}
      <div>
        <Button
          onClick={(e) => send(e)}
          color="primary"
          variant="contained"
          fullWidth
        >
          <Save fontSize="small" /> Valider
        </Button>
      </div>
    </div>
  );
}

export default React.memo(PlainteShop);
