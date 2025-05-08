import { SearchOutlined } from "@ant-design/icons";
import {
  AirplaneTicket,
  Done,
  DoneAll,
  Escalator,
  Pause,
  Search,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputAdornment,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import AutoComplement from "Control/AutoComplet";
import SimpleBackdrop from "Control/Backdrop";
import { CreateContexteGlobal } from "GlobalContext";
import { message } from "antd";
import axios from "axios";
import { isArray } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { config, lien_issue } from "static/Lien";
import Popup from "static/Popup";
import Adresse from "./Adresse";
import { CreateContexteTable } from "./Contexte";
import FormItem from "./FormItem";
import OpenForm from "./Formulaire/OpenForm";
import RaisonOngoing from "./Formulaire/RaisonOngoing";

function Form({ update }) {
  const {
    onchange,
    state,
    adresse,
    shopSelect,
    setShopSelect,
    historique,
    setHistorique,
    raisonOngoing,
    plainteSelect,
    setPlainteSelect,
    setState,
    otherItem,
    messages,
    item,
    setItem,
    sending,
    setSending,
    annuler,
  } = React.useContext(CreateContexteTable);

  const { codeclient, nomClient, contact, recommandation } = state;

  const [typeForm, setTypeForm] = React.useState("");

  const { client, setClient } = React.useContext(CreateContexteGlobal);
  const user = useSelector((state) => state?.user?.user);
  const [property, setProperty] = React.useState();
  React.useEffect(() => {
    if (user.plainte_callcenter) {
      setProperty("callcenter");
    }
    if (user.plainteShop) {
      setProperty("shop");
    }
  }, [user]);

  const [open, setOpen] = React.useState(false);
  const shop = useSelector((state) => state.shop?.shop);
  const [loadingcode, setLoadingcode] = React.useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: "" + texte,
      duration: 10,
    });
  };

  const plainte = useSelector((state) =>
    state.plainte.plainte.filter(
      (x) => x.property === property || x.property === "all"
    )
  );

  React.useEffect(() => {
    if (update) {
      let s = shop.filter((x) => x.shop === update.shop);
      setState({
        recommandation: update?.recommandation,
        nomClient: update?.nomClient,
        contact: update?.contact,
      });
      setShopSelect(s[0]);
    }
  }, [update]);

  const [openOngoing, setOpenOngoing] = React.useState(false);

  const [liste, setListe] = React.useState([]);

  const sendAppel = async (statut, e) => {
    try {
      e.preventDefault();
      if (
        isArray(user?.plainteShop) &&
        user.plainteShop.includes(shopSelect?.shop) === false
      ) {
        success(
          `Ce client n'est pas de votre shop << ${user?.plainteShop} >>`,
          "error"
        );
      } else {
        if (item?.adresse && !adresse) {
          success(
            "Les nouvelles adresses du client sont obligatoires",
            "error"
          );
        } else {
          setSending(true);

          const dataNonTech = {
            codeclient: codeclient,
            statut,
            delai: "IN SLA",
            shop: shopSelect?.shop,
            typePlainte: plainteSelect?.title,
            plainteSelect: item.other
              ? !item.oneormany
                ? otherItem?.title
                : liste.join(";")
              : item?.title,
            recommandation,
            nomClient,
            contact,
            raisonOngoing: raisonOngoing,
            adresse,
            open: statut === "closed" ? false : true,
            operation: statut === "escalade" ? "backoffice" : undefined,
          };
          const dataTicket = {
            typePlainte: plainteSelect?.title,
            plainte: item?.title,
            contact,
            codeclient,
            adresse,
            nomClient,
            statut,
            shop: shopSelect?.shop,
            commentaire: recommandation,
          };
          const data = item?.ticket ? dataTicket : dataNonTech;
          const link = item?.ticket ? "soumission_ticket" : "appel";

          const response = await axios.post(
            `${lien_issue}/${link}`,
            data,
            config
          );
          if (response.status === 201) {
            success(response.data, "warning");
            setSending(false);
          }
          if (response.status === 200) {
            success("Done", "success");
            setClient([response.data, ...client]);
            setSending(false);
            annuler();
          }
        }
      }
    } catch (error) {
      setSending(false);
      success("Error " + error, "error");
    }
  };
  const InfoClient = async (e) => {
    e.preventDefault();
    setLoadingcode(true);
    try {
      const response = await axios.get(
        `${lien_issue}/infoclient/${codeclient}`,
        config
      );
      if (response.status === 200) {
        if (response.data.info.length > 0) {
          setLoadingcode(false);
          onchange({
            target: {
              value: response.data.info[0].nomClient,
              name: "nomClient",
            },
          });
          setHistorique(response.data);
        } else {
          setShopSelect("");
          onchange({ target: { value: "", name: "nomClient" } });
          setLoadingcode(false);
          success("Aucune information trouvée", "warning");
        }
      }
    } catch (error) {
      console.log(error);
      setLoadingcode(false);
    }
  };
  React.useEffect(() => {
    if (historique && historique?.info.length > 0) {
      setShopSelect(historique.info[0]?.shop);
      setState({ ...state, nomClient: historique.info[0]?.nomClient });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historique]);

  React.useEffect(() => {
    if (item) {
      setTypeForm("");
      if (["GLVGG", "WVW3J"].includes(item.id)) {
        setTypeForm("Regularisation");
      }
      if (item.id === "RW38Z") {
        setTypeForm("Desangagement");
      }
      if (item.id === "L2N7T") {
        setTypeForm("Repossession");
      }
      if (item.id === "1GS1J") {
        setTypeForm("Downgrade");
      }
      if (item.id === "9NPC7") {
        setTypeForm("Upgrade");
      }
      if (item.id === "TRRIK") {
        setTypeForm("Information");
      }
      if (item.id === "CF5GL") {
        setTypeForm("Rafraichissement");
      }
    }
  }, [item]);

  const create_ticket = async (statut) => {
    try {
      setSending(true);
      const data = {
        typePlainte: plainteSelect?.title,
        contact,
        plainte: item?.title,
        codeclient,
        type: statut === "Educate_the_customer" ? "Education" : "ticket",
        statut,
        nomClient,
        shop: shopSelect?.shop,
        commentaire: recommandation,
      };
      const response = await axios.post(
        lien_issue + "/ticker_callcenter",
        data,
        config
      );
      if (response.status === 201) {
        success(response.data, "warning");
        setSending(false);
      }
      if (response.status === 200) {
        success("Done", "success");
        setClient([...client, response.data]);
        setSending(false);
        annuler();
      }
    } catch (error) {
      success("Erro " + error, "warning");
      setSending(false);
    }
  };
  const [items, setItems] = React.useState("");
  const searchItems = () => {
    if (plainteSelect) {
      let d = plainteSelect?.alltype.filter(
        (x) => x.property === property || x.property === "all"
      );
      setItems([
        ...d,
        {
          _id: "autre",
          title: "autre",
          idPlainte: "autre",
          id: "autre",
        },
      ]);
    }
  };
  React.useEffect(() => {
    if (plainteSelect) {
      searchItems();
    }
  }, [plainteSelect]);

  return (
    <>
      {contextHolder}
      {sending && (
        <SimpleBackdrop open={true} title="Please wait..." taille="10rem" />
      )}

      <Grid container>
        <Grid
          item
          lg={10}
          xs={10}
          sm={10}
          md={10}
          sx={{ paddingRight: "10px" }}
        >
          <FormControl sx={{ width: "100%" }}>
            <OutlinedInput
              size="small"
              id="header-search"
              startAdornment={
                <InputAdornment position="start" sx={{ mr: -0.5 }}>
                  <SearchOutlined />
                </InputAdornment>
              }
              aria-describedby="header-search-text"
              inputProps={{
                "aria-label": "weight",
              }}
              name="codeclient"
              value={codeclient}
              onChange={(e) => onchange(e)}
              placeholder="Code client"
            />
          </FormControl>
        </Grid>
        <Grid
          item
          lg={2}
          xs={2}
          sm={2}
          md={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loadingcode ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <Search onClick={(e) => InfoClient(e)} fontSize="small" />
          )}
        </Grid>
      </Grid>
      <div style={{ marginBottom: "10px" }}>
        <TextField
          onChange={(e) => onchange(e)}
          value={nomClient}
          style={{ marginTop: "10px" }}
          name="nomClient"
          autoComplete="off"
          fullWidth
          label="customer name"
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        {shop && (
          <AutoComplement
            value={shopSelect}
            setValue={setShopSelect}
            options={shop}
            title="Shop"
            propr="shop"
          />
        )}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <TextField
          onChange={(e) => onchange(e)}
          value={contact}
          style={{ marginTop: "10px" }}
          name="contact"
          autoComplete="off"
          fullWidth
          label="Contact"
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        {plainte && (
          <AutoComplement
            value={plainteSelect}
            setValue={setPlainteSelect}
            options={plainte}
            title="Plainte"
            propr="title"
          />
        )}
      </div>
      <div style={{ marginBottom: "10px" }}>
        {items && (
          <AutoComplement
            value={item}
            setValue={setItem}
            options={items}
            title="Probleme"
            propr="title"
          />
        )}
      </div>
      {item && item.other && item?.tableother.length > 0 && (
        <FormItem data={item} liste={liste} setListe={setListe} />
      )}

      <div style={{ marginBottom: "10px" }}>
        <TextField
          onChange={(e) => onchange(e)}
          value={recommandation}
          style={{ marginTop: "10px" }}
          name="recommandation"
          autoComplete="off"
          fullWidth
          label="Commentaire"
        />
      </div>
      <OpenForm type={typeForm} />
      {item && (
        <>
          {![
            "GLVGG",
            "WVW3J",
            "CF5GL",
            "TRRIK",
            "RW38Z",
            "L2N7T",
            "1GS1J",
            "9NPC7",
          ].includes(item.id) && (
            <div>
              {item?.ticket && item.id === "A8MDN" && (
                <Button
                  onClick={(e) =>
                    sendAppel(
                      item?.ticket ? "awaiting_confirmation" : "closed",
                      e
                    )
                  }
                  color="primary"
                  variant="contained"
                >
                  {!item?.ticket ? (
                    <Done fontSize="small" />
                  ) : (
                    <AirplaneTicket fontSize="small" />
                  )}{" "}
                  <span style={{ marginLeft: "10px" }}>
                    Demande_de_creation_ticket
                  </span>
                </Button>
              )}

              {item && item?.ticket && item.id !== "A8MDN" && (
                <>
                  <Button
                    onClick={() => create_ticket("Open_technician_visit")}
                    color="primary"
                    variant="contained"
                  >
                    <AirplaneTicket fontSize="small" />
                    <span style={{ marginLeft: "10px" }}>Ticket_creation</span>
                  </Button>
                  <Button
                    sx={{ marginLeft: "4px" }}
                    onClick={() => create_ticket("Educate_the_customer")}
                    color="primary"
                    variant="contained"
                  >
                    Educate_the_customer
                  </Button>
                </>
              )}

              {!item?.ticket && item?.id !== "LI2GP" && (
                <>
                  <Button
                    sx={{ margin: "0px 5px" }}
                    onClick={(e) => sendAppel("closed", e)}
                    color="primary"
                    variant="contained"
                  >
                    <DoneAll fontSize="small" />
                    <span style={{ marginLeft: "10px" }}>Closes</span>
                  </Button>
                  <Button
                    sx={{ margin: "0px 5px" }}
                    onClick={() => setOpenOngoing(true)}
                    color="secondary"
                    variant="contained"
                  >
                    <Pause fontSize="small" />
                    <span style={{ marginLeft: "10px" }}>Ongoing</span>
                  </Button>
                </>
              )}
              {!item?.ticket && (
                <Button
                  onClick={(e) => sendAppel("escalade", e)}
                  color="primary"
                  variant="contained"
                >
                  <Escalator fontSize="small" />{" "}
                  <span style={{ marginLeft: "5px" }}>Escalade</span>
                </Button>
              )}
              <Typography
                onClick={() => annuler()}
                sx={{ marginLeft: "3px", cursor: "pointer", color: "red" }}
                color="warning"
                variant="contained"
              >
                Annuler
              </Typography>
              {item?.adresse && (
                <Typography
                  component="span"
                  style={{
                    textAlign: "right",
                    fontSize: "12px",
                    cursor: "pointer",
                    color: "blue",
                    fontWeight: "bolder",
                    marginLeft: "20px",
                    textDecoration: "underline",
                  }}
                  onClick={() => setOpen(true)}
                >
                  Adresses
                </Typography>
              )}
            </div>
          )}
        </>
      )}
      {messages && (
        <p style={{ textAlign: "center", color: "red", fontSize: "14px" }}>
          {messages}
        </p>
      )}
      <Popup open={open} setOpen={setOpen} title="New customer addresses">
        <Adresse setOpen={setOpen} />
      </Popup>
      <Popup open={openOngoing} setOpen={setOpenOngoing} title="Raison">
        <RaisonOngoing sending={sending} func={sendAppel} />
      </Popup>
    </>
  );
}

export default React.memo(Form);
