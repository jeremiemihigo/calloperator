/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import SoundAudio from 'assets/audio/sound.wav';
import IconImage from 'assets/images/users/iconImage.jpg';
import _ from 'lodash';
import React, { createContext } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { config, lien_issue, lien_socket } from 'static/Lien';
import Popup from 'static/Popup';
import axios from '../node_modules/axios/index';
import './index.css';
export const CreateContexteGlobal = createContext();

const ContexteGlobal = (props) => {
  const [socket, setSocket] = React.useState(null);
  const user = useSelector((state) => state?.user.user);
  const [client, setClient] = React.useState([]);

  React.useEffect(() => {
    setSocket(io(lien_socket));
  }, []);
  React.useEffect(() => {
    if (socket !== null && user) {
      const data = { codeAgent: user.codeAgent, nom: user.nom, fonction: 'admin' };
      socket.emit('newUser', data);
    }
  }, [socket, user]);
  const navigation = useNavigate();
  const handleLogout = async () => {
    localStorage.removeItem('auth');
    navigation('/login');
  };

  const [nowCall, setNowCall] = React.useState();
  React.useEffect(() => {
    if (socket) {
      socket.on('plainte', (donner) => {
        setNowCall(donner);
      });
    }
  }, [socket]);
  // const audioRef = useRef(null);

  const playAudio = () => {
    try {
      const video = document.getElementById('video');
      video.muted = true; // Mute the video
      video
        .play()
        .then(() => {
          // Unmute once the video starts playing
          video.muted = false;
        })
        .catch((error) => {
          console.log('Autoplay error:', error);
        });
    } catch (error) {
      console.log(error);
    }

    // audioRef.current.play();
  };
  const fetchAndAdd = () => {
    try {
      if (client && client.length > 0) {
        let i = _.filter(client, { idPlainte: nowCall.idPlainte });
        if (i.length > 0) {
          let index = client.indexOf({ idPlainte: nowCall.idPlainte });
          let lastValue = [...client];
          lastValue[index] = nowCall;
          setClient(lastValue);
        } else {
          setClient([...client, nowCall]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    try {
      if (nowCall) {
        if (user?.backOffice_plainte && nowCall?.operation === 'backoffice') {
          fetchAndAdd();
          playAudio();
        } else {
          if (
            user?.fonction === 'superUser' ||
            (user?.fonction === 'admin' && user?.plainteShop === nowCall?.shop) ||
            (user?.synchro_shop.length > 0 && user?.synchro_shop.includes(nowCall?.shop)) ||
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
      socket.on('userConnected', (donner) => {
        setDataChange(donner);
      });
    }
  }, [socket, user]);

  //Recuperation de la demande envoyee par le socket
  const [donner, setDonner] = React.useState();
  React.useEffect(() => {
    if (socket) {
      socket.on('demande', (donner) => {
        if (donner._id) {
          setDonner(donner);
        }
      });
    }
  }, [socket]);

  React.useEffect(() => {
    if (donner) {
      let all = [...allListe, donner];
      setData(_.groupBy(all, 'zone.denomination'));
    }
  }, [donner]);

  //Recuperation de la reponse
  const [new_reponse, set_new_Reponse] = React.useState();
  const [reponseNow, setReponseNow] = React.useState([]);
  React.useEffect(() => {
    if (socket) {
      socket.on('reponse', (donner) => {
        if (donner._id) {
          set_new_Reponse(donner);
        }
      });
    }
  }, [socket]);
  React.useEffect(() => {
    if (socket) {
      socket.on('chat', (donner) => {
        if (donner.idDemande) {
          set_new_Reponse(donner);
        }
      });
    }
  }, [socket]);

  React.useEffect(() => {
    try {
      if (new_reponse) {
        let filter = allListe.filter((x) => x.idDemande !== new_reponse.idDemande);
        setAllListe(filter);
        setData(_.groupBy(filter, 'zone.denomination'));
        if (new_reponse._id) {
          setReponseNow([new_reponse, ...reponseNow]);
          set_new_Reponse();
        }
        if (demande?.idDemande === new_reponse?.idDemande) {
          setDemande();
          set_new_Reponse();
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
      socket.on('message', (donner) => {
        setMessageAlert(donner);
        playAudio();
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
  console.log(messageAlert);

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
        setUpdate,
        demande,
        data,
        setData,
        allListe,
        setAllListe,
        setDemande,
        reponseNow
      }}
    >
      <audio id="video" src={SoundAudio}>
        <track kind="captions" src="captions.vtt" srcLang="en" label="English" default />
      </audio>

      <Popup open={openPopup} setOpen={setOpenPopup} title={`ID : ${messageAlert?.plainte?.codeclient}`}>
        <div style={{ width: '20rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <img width={20} height={20} src={IconImage} alt="userIcon" />
            </div>
            <div style={{ display: 'flex', alignContent: 'center' }}>
              <p style={{ marginLeft: '20px', padding: '0px', margin: '0px' }}>{messageAlert?.agent}</p>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <p>{messageAlert?.content}</p>
          </div>
        </div>
      </Popup>
      {props.children}
    </CreateContexteGlobal.Provider>
  );
};
export default React.memo(ContexteGlobal);
