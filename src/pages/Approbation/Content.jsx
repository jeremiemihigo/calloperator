import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Image } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { lien_image } from "static/Lien";
import Popup from "static/Popup";
import Formulaire from "./Formulaire";

export default function ContentDemande({ item, data, setData }) {
  const agent = useSelector((state) => state.agent.agent);
  const returnAgent = (id, key) => {
    if (agent && agent.length > 0) {
      if (key === "shop") {
        return _.filter(agent, { codeAgent: id })[0]?.shop[0]?.shop;
      } else {
        return _.filter(agent, { codeAgent: id })[0]?.nom;
      }
    } else {
      return "";
    }
  };
  const [openForm, setOpenForm] = React.useState(false);
  const functionopen = () => {
    setOpenForm(true);
  };
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <Image
          width={300}
          height={100}
          src={`${lien_image}/${item.file}`}
          placeholder={
            <Image
              preview={false}
              src={`${lien_image}/${item.file}`}
              width={200}
            />
          }
        />
        <CardContent>
          <Typography gutterBottom variant="h6" noWrap component="p">
            {item.codeAgent + "; "} {returnAgent(item.codeAgent, "nom")}
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Shop : {returnAgent(item.codeAgent, "shop")}
          </Typography>
          <Typography variant="body1" sx={{ color: "rgb(0,169,254)" }}>
            {item.conversation[item.conversation.length - 1].message}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="inherit" onClick={() => functionopen()}>
          Next step
        </Button>
      </CardActions>
      <Popup
        open={openForm}
        setOpen={setOpenForm}
        title={item.conversation[item.conversation.length - 1].message}
      >
        <Formulaire data={data} setData={setData} onselect={item} />
      </Popup>
    </Card>
  );
}
