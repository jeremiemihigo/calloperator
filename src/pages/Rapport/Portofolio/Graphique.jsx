import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

// ==============================|| SALES COLUMN CHART ||============================== //

const SalesColumnChart = ({ data }) => {
  console.log(data);
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const warning = theme.palette.warning.main;
  const primaryMain = theme.palette.primary.main;
  const successDark = theme.palette.success.dark;
  const [series] = useState([
    {
      name: "Default",
      data: [100, 100, 448],
    },
    {
      name: "Late",
      data: [50, 70, 300],
    },
  ]);

  const [options, setOptions] = useState({
    chart: {
      type: "bar",
      height: 430,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: ["Readable", "Unreadable", "Remind"],
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 8,
      colors: ["transparent"],
    },

    yaxis: {
      title: {
        text: "$ (thousands)",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter(val) {
          return ` ${val} ${val > 1 ? "clients" : "client"}`;
        },
      },
    },
    legend: {
      show: true,
      fontFamily: `'Public Sans', sans-serif`,
      offsetX: 10,
      offsetY: 10,
      labels: {
        useSeriesColors: false,
      },
      markers: {
        width: 16,
        height: 16,
        radius: "50%",
        offsexX: 2,
        offsexY: 2,
      },
      itemMargin: {
        horizontal: 15,
        vertical: 10,
      },
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          yaxis: {
            show: false,
          },
        },
      },
    ],
  });

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [warning, primaryMain],
      xaxis: {
        labels: {
          style: {
            colors: [
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
            ],
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary],
          },
        },
      },
      grid: {
        borderColor: line,
      },
      tooltip: {
        theme: "light",
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        labels: {
          colors: "grey.500",
        },
      },
    }));
  }, [primary, secondary, line, warning, primaryMain, successDark]);
  return (
    <>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={400}
      />
    </>
  );
};

export default SalesColumnChart;
