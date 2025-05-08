import { Button } from "@mui/material";
import AutoComplement from "Control/AutoComplet";
import SimpleBackdrop from "Control/Backdrop";
import { AjuterShopAgent } from "Redux/AgentAdmin";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function PlainteShop() {
  const shop = useSelector((state) => state.shop?.shop);
  const [shopSelect, setShopSelect] = React.useState("");
  const agentadmin = useSelector((state) => state.agentAdmin);
  const [agentSelect, setAgentSelect] = React.useState("");

  const dispatch = useDispatch();
  const send = (e) => {
    e.preventDefault();
    dispatch(
      AjuterShopAgent({
        idAgent: agentSelect?._id,
        plainteShop: shopSelect?.shop,
      })
    );
    setAgentSelect("");
    setShopSelect("");
  };
  return (
    <div style={{ width: "22rem" }}>
      {agentadmin.ajoutershop === "pending" && (
        <SimpleBackdrop open={true} taille="10rem" title="Please wait..." />
      )}
      {shop && (
        <div style={{ margin: "10px 0px" }}>
          <AutoComplement
            value={shopSelect}
            setValue={setShopSelect}
            options={shop}
            title="Shop"
            propr="shop"
          />
        </div>
      )}
      {agentadmin?.agentAdmin && (
        <div style={{ margin: "10px 0px" }}>
          <AutoComplement
            value={agentSelect}
            setValue={setAgentSelect}
            options={agentadmin?.agentAdmin}
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
          Valider
        </Button>
      </div>
    </div>
  );
}

export default React.memo(PlainteShop);
