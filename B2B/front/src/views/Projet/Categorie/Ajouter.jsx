import { Edit, Save } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Addcategorie, ModifierCategorie } from "src/Redux/categorisation";
import DirectionSnackbar from "src/static/SnackBar";

function Ajouter({ data }) {
  const categorie = useSelector((state) => state.categorie);
  const [title, setTitle] = React.useState("");
  const dispatch = useDispatch();
  const sendData = (event) => {
    event.preventDefault();
    try {
      dispatch(Addcategorie({ title }));
      setTitle("");
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    if (data) {
      setTitle(data.title);
    }
  }, [data]);
  const EditData = (event) => {
    event.preventDefault();
    try {
      dispatch(ModifierCategorie({ id: data?.id, title }));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {categorie.savecategorie === "success" && (
        <DirectionSnackbar message="Enregistrement effectué" />
      )}
      {categorie.savecategorie === "rejected" && (
        <DirectionSnackbar message={categorie.savecategorieError} />
      )}
      {categorie.editcategorie === "success" && (
        <DirectionSnackbar message="Modification effectuée" />
      )}
      {categorie.editcategorie === "rejected" && (
        <DirectionSnackbar message={categorie.editcategorieError} />
      )}
      <TextField
        name="title"
        label="Titre"
        variant="outlined"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        fullWidth
        multiline
        sx={{
          mt: 2,
          mb: 2,
          minWidth: "20rem",
        }}
      />
      <Button
        onClick={data ? (event) => EditData(event) : (event) => sendData(event)}
        variant="contained"
        color="primary"
        fullWidth
      >
        {data ? <Edit fontSize="small" /> : <Save fontSize="small" />}{" "}
        {data ? " Edit" : " Send"}
      </Button>
    </div>
  );
}

export default Ajouter;
