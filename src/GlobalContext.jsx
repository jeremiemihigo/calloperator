/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import IconImage from "assets/images/users/user.svg";
import _ from "lodash";
import React, { createContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { config, lien_issue, lien_socket } from "static/Lien";
import Popup from "static/Popup";
import axios from "../node_modules/axios/index";
import "./index.css";
export const CreateContexteGlobal = createContext();

const ContexteGlobal = (props) => {
  const [socket, setSocket] = React.useState(null);
  const user = useSelector((state) => state?.user.user);
  const [client, setClient] = React.useState([]);
  const [resetData, setResetData] = React.useState("");

  React.useEffect(() => {
    setSocket(io(lien_socket));
  }, []);
  React.useEffect(() => {
    if (socket !== null && user) {
      const data = {
        codeAgent: user.codeAgent,
        backOffice: user?.backOffice_plainte,
        nom: user.nom,
        fonction: "admin",
      };
      socket.emit("newUser", data);
    }
  }, [socket, user]);
  const navigation = useNavigate();
  const handleLogout = async () => {
    localStorage.removeItem("auth");
    navigation("/login");
  };

  const [nowCall, setNowCall] = React.useState();
  React.useEffect(() => {
    if (socket) {
      socket.on("plainte", (donner) => {
        setNowCall(donner);
      });
    }
  }, [socket]);

  const fetchAndAdd = () => {
    try {
      if (client && client.length > 0) {
        let i = _.filter(client, { idPlainte: nowCall.idPlainte });
        if (i.length > 0) {
          setClient(client.map((x) => (x._id === nowCall._id ? nowCall : x)));
          // let index = client.indexOf({ idPlainte: nowCall.idPlainte });
          // let lastValue = [...client];
          // lastValue[index] = nowCall;
          // setClient(lastValue);
        } else {
          setClient([...client, nowCall]);
        }
      } else {
        setClient(nowCall);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    try {
      if (nowCall) {
        if (user?.backOffice_plainte && nowCall?.operation === "backoffice") {
          fetchAndAdd();
        } else {
          if (
            user?.fonction === "superUser" ||
            (user?.fonction === "admin" &&
              user?.plainteShop === nowCall?.shop) ||
            (user?.synchro_shop.length > 0 &&
              user?.synchro_shop.includes(nowCall?.shop)) ||
            (user?.plainte_callcenter && nowCall?.submitedBy === user?.nom)
          ) {
            fetchAndAdd();
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [nowCall]);

  const [demande, setDemande] = React.useState();
  const [update, setUpdate] = React.useState();
  const [chat, setChat] = React.useState();

  const [data, setData] = React.useState([]);
  const [allListe, setAllListe] = React.useState([]);

  const [user_connect, setDataChange] = React.useState([]);
  React.useEffect(() => {
    if (socket) {
      socket.on("userConnected", (donner) => {
        setDataChange(donner);
      });
    }
  }, [socket, user]);

  //Recuperation de la demande envoyee par le socket
  const [donner, setDonner] = React.useState();
  React.useEffect(() => {
    if (socket) {
      socket.on("demande", (donner) => {
        if (donner._id) {
          setDonner(donner);
        }
      });
    }
  }, [socket]);

  React.useEffect(() => {
    if (donner) {
      let all = [...allListe, donner];
      setData(_.groupBy(all, "codeZone"));
    }
  }, [donner]);

  //Recuperation de la reponse
  const [new_reponse, set_new_Reponse] = React.useState();
  const [reponseNow, setReponseNow] = React.useState([]);
  const changeReponse = (items) => {
    let out = reponseNow.map((x) => (x._id === items._id ? items : x));
    setReponseNow(out);
  };
  React.useEffect(() => {
    if (socket) {
      socket.on("reponse", (donner) => {
        if (donner._id) {
          set_new_Reponse(donner);
        }
      });
    }
  }, [socket]);
  React.useEffect(() => {
    if (socket) {
      socket.on("chat", (donner) => {
        if (donner.idDemande) {
          set_new_Reponse(donner);
        }
      });
    }
  }, [socket]);

  React.useEffect(() => {
    try {
      if (new_reponse) {
        let filter = allListe.filter(
          (x) => x.idDemande !== new_reponse.idDemande
        );
        setAllListe(filter);
        setData(_.groupBy(filter, "codeZone"));
        if (new_reponse._id) {
          setReponseNow([new_reponse, ...reponseNow]);
          set_new_Reponse();
        }
        if (demande?.idDemande === new_reponse?.idDemande) {
          setDemande();
          set_new_Reponse();
          setResetData(demande?.idDemande);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [new_reponse]);

  const [messageAlert, setMessageAlert] = React.useState();
  const [openPopup, setOpenPopup] = React.useState(false);
  React.useEffect(() => {
    if (socket) {
      socket.on("message", (donner) => {
        setMessageAlert(donner);
        setOpenPopup(true);
      });
    }
  }, [socket]);

  const loadingCustomer = async () => {
    try {
      const response = await axios.get(`${lien_issue}/client`, config);
      if (response.status === 200) {
        setClient(response.data);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    loadingCustomer();
  }, []);

  return (
    <CreateContexteGlobal.Provider
      value={{
        socket,
        handleLogout,
        user_connect,

        //Issue team
        client,
        setClient,
        chat,
        //Support_team
        setChat,
        update,
        changeReponse,
        setUpdate,
        demande,
        resetData,
        data,
        setResetData,
        setData,
        allListe,
        setAllListe,
        setDemande,
        reponseNow,
      }}
    >
      <Popup
        open={openPopup}
        setOpen={setOpenPopup}
        title={`ID : ${messageAlert?.plainte?.codeclient}`}
      >
        <div style={{ width: "20rem" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>
              <img width={20} height={20} src={IconImage} alt="userIcon" />
            </div>
            <div style={{ display: "flex", alignContent: "center" }}>
              <p style={{ marginLeft: "20px", padding: "0px", margin: "0px" }}>
                {messageAlert?.agent}
              </p>
            </div>
          </div>
          <div style={{ marginTop: "10px" }}>
            <p>{messageAlert?.content}</p>
          </div>
        </div>
      </Popup>
      {props.children}
    </CreateContexteGlobal.Provider>
  );
};
export default React.memo(ContexteGlobal);
