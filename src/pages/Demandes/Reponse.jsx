/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import { Delete, Edit } from "@mui/icons-material";
import { Card, Grid, Tooltip, Typography } from "@mui/material";
import { Image, Space, message } from "antd";
import axios from "axios";
import BasicTabs from "Control/Tabs";
import { CreateContexteGlobal } from "GlobalContext";
import _ from "lodash";
import moment from "moment";
import WhyToDelete from "pages/Reponse/WhyToDelete";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { lien, lien_image } from "static/Lien";
import Popup from "static/Popup";
import Chat from "./Chat";
import { CreateContexteDemande } from "./ContextDemande";
import FeedbackComponent from "./FeedBack";
import ReponsesComponent from "./ReponseComponent";
import "./style.css";
import UpdateForm from "./Updateform";

function ReponseAdmin(props) {
  const { update } = props;
  const { demande, reponseNow } = useContext(CreateContexteGlobal);
  const { changeRecent, lastImages, recentAnswerSelect } = useContext(
    CreateContexteDemande
  );
  const titres = [
    { id: 0, label: "Reponse" },
    { id: 1, label: "Feedback" },
  ];
  const components = [
    { id: 0, component: <ReponsesComponent update={update} /> },
    {
      id: 1,
      component: <FeedbackComponent demande={demande} update={update} />,
    },
  ];
  const getColor = (item) => {
    return !item && "red";
  };

  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte) => {
    navigator.clipboard.writeText(texte);
    messageApi.open({
      type: "success",
      content: "Done " + texte,
      duration: 2,
    });
  };
  const [feedback, setFeedback] = React.useState();
  const loadingFeedback = async () => {
    try {
      const response = await axios.get(lien + "/readfeedback/all");
      if (response.status === 200) {
        setFeedback(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loadingFeedback();
  }, []);
  const returnFeedback = (id) => {
    if (_.filter(feedback, { id }).length > 0) {
      return _.filter(feedback, { id })[0].title;
    } else {
      return id;
    }
  };
  function AfficherJsx({ demandes }) {
    return (
      <div className="demandeJsx" style={{ textAlign: "justify" }}>
        {demandes.feedbackrs && (
          <p
            style={{
              padding: "0px",
              margin: "0px",
              fontSize: "14px",
              color: "red",
              fontWeight: "bolder",
            }}
          >
            RS : <span>{demandes.feedbackrs}</span>
          </p>
        )}
        {demandes.codeclient !== "undefined" && (
          <Typography
            component="p"
            className="codeClient"
            onClick={() => success(demandes.codeclient)}
            style={{
              color: getColor(demandes.codeclient),
              fontSize: "15px",
              fontWeight: "bolder",
            }}
          >
            code client :{" "}
            {demandes.codeclient && demandes.codeclient.toUpperCase()}
          </Typography>
        )}

        {demandes.numero !== "undefined" && (
          <p>Numéro joignable du client: {demandes.numero}</p>
        )}

        <p>
          Statut du client :{" "}
          {`${demandes.statut === "allumer" ? "allumé" : "éteint"}`}{" "}
        </p>
        <p>Sector : {demandes?.sector} </p>
        <p>Cell : {demandes?.cell} </p>
        <p>Sat : {demandes?.sat} </p>
        <p>Reference : {demandes?.reference} </p>
        <p>Feedback : {returnFeedback(demandes.raison)}</p>
        <div style={{ width: "80%" }}>
          <Chat demandes={demandes.conversation} />
        </div>
      </div>
    );
  }
  const regions = useSelector((state) => state.zone.zone);
  const returnZone = (id) => {
    return _.filter(regions, { idZone: id })[0]?.denomination;
  };
  const returnName = (name) => {
    return name.split(" ")[name.split(" ").length - 1];
  };
  const [datadelete, setDataDelete] = React.useState();
  const [open, setOpen] = React.useState(false);
  const openDelete = (donner) => {
    setDataDelete(donner);
    setOpen(true);
  };
  const userconnect = useSelector((state) => state.user.user);
  return (
    <div className="reponsecomponent">
      <>{contextHolder}</>
      <div>
        <div>
          <div className="reponsestatic">
            {(demande || update) && (
              <>
                <Space size={12}>
                  <Image
                    width={200}
                    height={200}
                    src={`${lien_image}/${
                      update ? update.demande.file : demande.file
                    }`}
                    placeholder={
                      <Image
                        preview={false}
                        src={`${lien_image}/${
                          update ? update.demande.file : demande.file
                        }`}
                        width={200}
                      />
                    }
                  />
                </Space>

                {demande && !update && feedback && (
                  <AfficherJsx demandes={demande} />
                )}
                {update && feedback && (
                  <AfficherJsx demandes={update.demande} />
                )}
                <p style={{ textAlign: "center", fontWeight: "bolder" }}>
                  {lastImages && lastImages.length + " Recente(s) image(s)"}{" "}
                </p>
                <Grid container sx={{ marginTop: "10px" }}>
                  {lastImages &&
                    lastImages.length > 0 &&
                    lastImages.map((index) => {
                      return (
                        <Grid
                          sx={{ paddingRight: "5px" }}
                          item
                          lg={3}
                          key={index._id}
                        >
                          <Space>
                            <Image
                              height={50}
                              width={50}
                              src={`${lien_image}/${index?.demande?.file}`}
                              placeholder={
                                <Image
                                  preview={false}
                                  src={`${lien_image}/${index?.demande?.file}`}
                                  width={200}
                                />
                              }
                            />
                          </Space>{" "}
                        </Grid>
                      );
                    })}
                </Grid>
              </>
            )}
          </div>
        </div>
        {!demande && reponseNow && reponseNow.length > 0 && (
          <div style={{ marginTop: "30px", width: "100%" }}>
            <p>Recent answers</p>
            {reponseNow.map((index) => {
              return (
                <Card
                  sx={{ width: "100%" }}
                  className={
                    recentAnswerSelect && index._id === recentAnswerSelect?._id
                      ? "colorGreen"
                      : "colornogreen"
                  }
                  key={index._id}
                >
                  <div>
                    <Typography
                      component="p"
                      noWrap
                      style={{
                        padding: "0px",
                        fontSize: "12px",
                        margin: "0px",
                        width: "100%",
                      }}
                    >
                      {returnName(index.agentSave?.nom)};
                      {returnZone(index.idZone)}
                    </Typography>
                    <Typography
                      component="p"
                      noWrap
                      style={{
                        padding: "0px",
                        justifyContent: "space-between",
                        fontSize: "12px",
                        margin: "0px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span>
                        {index?.consExpDays + "jr(s)"};
                        {" " + index?.PayementStatut}
                      </span>
                    </Typography>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "9px",
                        padding: "0px",
                        margin: "0px",
                      }}
                    >
                      {moment(index.createdAt).fromNow()}
                    </p>
                    {(index.agentSave.nom === userconnect.nom ||
                      userconnect.fonction === "superUser") && (
                      <div className="optionsicons">
                        <Tooltip title="Modification">
                          <Edit
                            fontSize="small"
                            sx={{ marginRight: "15px" }}
                            onClick={() => changeRecent(index)}
                          />
                        </Tooltip>
                        <Tooltip title="Suppression">
                          <Delete
                            fontSize="small"
                            onClick={() => openDelete(index.idDemande)}
                          />
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <div>
        <div className="reponsestatic" style={{ paddingRight: "10px" }}>
          {recentAnswerSelect ? (
            <UpdateForm update={recentAnswerSelect} show={true} />
          ) : (
            <BasicTabs titres={titres} components={components} />
          )}
        </div>
      </div>
      {datadelete && (
        <Popup open={open} setOpen={setOpen} title="Supprimer la demande">
          <WhyToDelete id={datadelete} />
        </Popup>
      )}
    </div>
  );
}

export default React.memo(ReponseAdmin);
