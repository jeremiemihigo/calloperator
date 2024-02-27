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

  const loading = async () => {
    try {
      const response = await axios.get(lien + '/demandePourChaquePeriode', config);

      let table = [];
      let option = [];
      if (response.data.length > 0) {
        for (let i = 0; i < response.data.length; i++) {
          table.push(response.data[i].total);
          option.push(response.data[i]._id);
        }
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
  };
  useEffect(() => {
    loading();
  }, []);

  return <>{options && series && options.length > 0 && series.length > 0 && <ReactApexChart options={options} series={series} type="line" height={345} />}</>;
};

export default ReportAreaChart;
