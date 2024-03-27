/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

// material-ui

// third-party
import ReactApexChart from 'react-apexcharts';
import { lien, config } from 'static/Lien';
import axios from 'axios';

// chart options

// ==============================|| REPORT AREA CHART ||============================== //

const ReportAreaChart = () => {
  const [options, setOptions] = useState();
  const [series, setSerie] = useState();
  const [donner, setDonner] = useState();

  const loadingData = () => {
    if (donner && donner.length > 0) {
      try {
        let table = [];
        let option = [];
        for (let i = 0; i < donner.length; i++) {
          table.push(donner[i].total);
          option.push(donner[i]._id);
        }

        setOptions({
          chart: {
            id: 'basic-bar'
          },
          xaxis: {
            categories: option
          }
        });
        setSerie([
          {
            name: 'Demande au total',
            data: table
          }
        ]);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const [load, setLoad] = useState(false);
  const loading = async () => {
    setLoad(true);
    try {
      const response = await axios.get(lien + '/demandePourChaquePeriode', config);
      setDonner(response.data);
      setLoad(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loading();
  }, []);
  useEffect(() => {
    loadingData();
  }, [donner]);

  return (
    <div>
      {load ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '20rem' }}>
          <p style={{ textAlign: 'center' }}>Loading...</p>
        </div>
      ) : (
        options && series && <ReactApexChart options={options} series={series} type="line" height={345} />
      )}
    </div>
  );
};

export default ReportAreaChart;
