/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import SoundAudio from 'assets/audio/sound.wav';
import axios from 'axios';
import _ from 'lodash';
import React, { createContext, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { config, lien_issue, lien_socket } from 'static/Lien';
import './index.css';
export const CreateContexteGlobal = createContext();

const ContexteGlobal = (props) => {
  const [socket, setSocket] = React.useState(null);
  const user = useSelector((state) => state?.user.user);
  const [client, setClient] = React.useState([]);
  const [loadingClient, setLoadingClient] = React.useState(false);

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
  const loading = async () => {
    try {
      setLoadingClient(true);
      const response = await axios.get(lien_issue + '/client', config);
      if (response.data === 'token expired') {
        handleLogout();
      } else {
        setClient(response.data);
        setLoadingClient(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, []);
  const [nowCall, setNowCall] = React.useState();
  React.useEffect(() => {
    if (socket) {
      socket.on('plainte', (donner) => {
        setNowCall(donner);
      });
    }
  }, [socket]);
  const audioRef = useRef(null);

  const playAudio = () => {
    audioRef.current.play();
  };
  const fetchAndAdd = () => {
    if (_.filter(client, { _id: nowCall?._id }).length > 0) {
      setClient(client.map((x) => (x.idPlainte === nowCall.idPlainte ? nowCall : x)));
    } else {
      setClient([nowCall, ...client]);
    }
  };
  React.useEffect(() => {
    if (nowCall) {
      if (user?.backOffice_plainte && nowCall?.operation === 'backoffice') {
        fetchAndAdd();
        playAudio();
      } else {
        fetchAndAdd();
      }
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
  }, [new_reponse]);

  return (
    <CreateContexteGlobal.Provider
      value={{
        socket,
        handleLogout,
        user_connect,

        //Issue team
        client,
        setClient,
        loadingClient,
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
      <audio ref={audioRef} src={SoundAudio}>
        <track kind="captions" src="captions.vtt" srcLang="en" label="English" default />
      </audio>
      {props.children}
    </CreateContexteGlobal.Provider>
  );
};
export default React.memo(ContexteGlobal);
