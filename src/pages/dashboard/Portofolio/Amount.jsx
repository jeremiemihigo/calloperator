/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import { config, portofolio } from "static/Lien";
import { Paper } from "@mui/material";

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
          table.push(donner[i].value);
          option.push(donner[i].name);
        }

        setOptions({
          chart: {
            id: "basic-bar",
          },
          xaxis: {
            categories: option,
          },
        });
        setSerie([
          {
            name: "$",
            data: table,
          },
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
      const response = await axios.get(portofolio + "/seachAmount", config);
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
    <Paper sx={{ marginTop: "10px" }}>
      {load ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "20rem",
          }}
        >
          <p style={{ textAlign: "center" }}>Loading...</p>
        </div>
      ) : (
        options &&
        series && (
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={345}
          />
        )
      )}
    </Paper>
  );
};

export default ReportAreaChart;
