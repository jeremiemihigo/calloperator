import { Button, Checkbox, TextField } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Adduser } from "../../Redux/AllUser";
import { allpermission } from "../../static/Lien";
import DirectionSnackbar from "../../Static/SnackBar";
import "./user.style.css";

function FormUser() {
  //name, username, permission
  const [permission, setPermission] = React.useState([]);
  const [initiale, setInitiale] = React.useState({
    name: "",
    username: "",
  });
  const { name, username } = initiale;
  const onchange = (event) => {
    const { name, value } = event.target;
    setInitiale({
      ...initiale,
      [name]: value,
    });
  };
  const onclickpermission = (id) => {
    if (permission.includes(id)) {
      setPermission(permission.filter((x) => x !== id));
    } else {
      setPermission([...permission, id]);
    }
  };
  const [message, setMessage] = React.useState();

  const dispatch = useDispatch();
  const alluser = useSelector((state) => state.alluser);
  const sendData = async (event) => {
    event.preventDefault();
    if (permission.length === 0) {
      setMessage("Veuillez selectionner les permissions");
    } else {
      try {
        dispatch(Adduser({ name, username, permission }));
        setInitiale({ name: "", username: "" });
        setPermission([]);
      } catch (error) {
        setMessage(error.message);
      }
    }
  };
  return (
    <div style={{ padding: "5px" }}>
      {message && <DirectionSnackbar message={message} />}
      {alluser.saveuser === "rejected" && (
        <DirectionSnackbar message={alluser.saveuserError} />
      )}
      <TextField
        id="name"
        name="name"
        onChange={(event) => onchange(event)}
        label="Full name"
        value={name}
        variant="outlined"
        fullWidth
        sx={{
          mb: 2,
        }}
      />
      <TextField
        id="username"
        name="username"
        onChange={(event) => onchange(event)}
        label="Email adress"
        value={username}
        variant="outlined"
        fullWidth
        sx={{
          mb: 2,
        }}
      />
      <div>
        {allpermission.map((index) => {
          return (
            <div
              onClick={() => onclickpermission(index.value)}
              key={index.id}
              className="checkboxx"
            >
              <p>{index.title}</p>
              <Checkbox checked={permission.includes(index.value)} />
            </div>
          );
        })}
      </div>
      <div>
        <Button
          onClick={(event) => sendData(event)}
          color="primary"
          variant="contained"
          disabled={alluser.saveuser === "pending"}
          fullWidth
        >
          Valider
        </Button>
      </div>
    </div>
  );
}

export default FormUser;
