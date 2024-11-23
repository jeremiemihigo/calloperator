import { Skeleton } from '@mui/material';
import axios from 'axios';
import Dot from 'components/@extended/Dot';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { config, lien_issue } from 'static/Lien';

function Backoffice_Analyse() {
  const navigate = useNavigate();
  const [deedline, setDeedline] = React.useState();

  const ReadData_backoffice = async () => {
    try {
      const response = await axios.get(`${lien_issue}/backoffice_data`, config);
      if (response.status === 201 && response.data === 'token expired') {
        navigate('/login');
      }
      if (response.status === 200) {
        setDeedline(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    ReadData_backoffice();
  }, []);

  const returnData = (delai) => {
    const totalSum = deedline.reduce((acc, item) => acc + item.total, 0);
    const d = (deedline.filter((x) => x._id === delai)[0]?.total * 100) / totalSum;
    return isNaN(d.toFixed(0)) ? 0 : d.toFixed(0);
  };

  return (
    <div>
      From the beginning of the month to date
      {deedline && deedline.length > 0 ? (
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Dot color="error" />
            <p style={{ padding: '0px', margin: '0px', marginLeft: '5px', fontWeight: 'bolder' }}>{returnData('OUT SLA')}%</p>
          </div>
          <div style={{ display: 'flex', marginLeft: '20px', alignItems: 'center', justifyContent: 'center' }}>
            <Dot color="success" />
            <p style={{ padding: '0px', margin: '0px', marginLeft: '5px', fontWeight: 'bolder' }}>{returnData('IN SLA')}%</p>
          </div>
        </div>
      ) : (
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '15rem' }} />
      )}
    </div>
  );
}

export default Backoffice_Analyse;
