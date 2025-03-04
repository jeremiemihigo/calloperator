import axios from 'axios';
import LoaderGif from 'components/LoaderGif';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { config, lien_dt } from 'static/Lien';
import Acceuil from './Acceuil';
import './detailclient.style.css';
function Index() {
  const location = useLocation();
  const { state } = location;
  const [data, setData] = React.useState();

  const loading = async () => {
    try {
      const response = await axios.get(`${lien_dt}/information/${state}`, config);
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {}
  };
  React.useEffect(() => {
    if (state) {
      loading();
    } else {
      window.location.replace('/login');
    }
  }, [state]);
  return <>{!data ? <LoaderGif width={400} height={400} /> : <Acceuil client={data[0]} />}</>;
}

export default Index;
