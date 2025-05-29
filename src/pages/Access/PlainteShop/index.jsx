import { Typography } from "@mui/material";
import ConfirmDialog from "Control/ControlDialog";
import { isArray } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import Popup from "static/Popup";
import Form from "./Form";

function Index() {
  const [open, setOpen] = React.useState(false);
  const agentadmin = useSelector((state) =>
    state.agentAdmin?.agentAdmin.filter(
      (x) => isArray(x.plainteShop) && x.plainteShop.length > 0
    )
  );

  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  return (
    <div>
      <Typography
        sx={{ color: "blue", marginBottom: "10px", cursor: "pointer" }}
        onClick={() => setOpen(true)}
      >
        Ajoutez
      </Typography>
      <div>
        <table>
          <thead>
            <tr>
              <td>Staff</td>
              <td>Shop</td>
            </tr>
          </thead>
          <tbody>
            {agentadmin &&
              agentadmin.map((index) => {
                console.log(index);
                return (
                  <tr key={index._id}>
                    <td>{index.nom}</td>
                    <td>
                      {index.plainteShop.map((item, key) => {
                        return <span key={key}>{item}; </span>;
                      })}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <Popup open={open} setOpen={setOpen} title="Shop">
        <Form />
      </Popup>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </div>
  );
}

export default Index;
