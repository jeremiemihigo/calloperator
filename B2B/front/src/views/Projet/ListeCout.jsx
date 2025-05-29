import { Typography } from "@mui/material";
import axios from "axios";
import _ from "lodash";
import moment from "moment";
import React from "react";
import { config, lien } from "../../static/Lien";
import Loading from "../../static/Loading";
import "./Detail/detail.style.css";

function ListeCout({ concerne }) {
  const [data, setData] = React.useState([]);
  const [load, setLoad] = React.useState(false);
  const loading = async () => {
    try {
      setLoad(true);
      const response = await axios.get(
        `${lien}/readDepense/${concerne}`,
        config
      );
      if (response.status === 200) {
        setData(response.data);
        setLoad(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, [concerne]);
  return (
    <>
      {load ? (
        <Loading />
      ) : (
        <>
          <div className="export_excel">
            <Typography component="p">Export to Excel</Typography>
          </div>
          <div className="tableau_detail">
            <table>
              <thead>
                <tr>
                  <td>#</td>
                  <td>Date</td>
                  <td>Action</td>
                  <td>Motif</td>
                  <td>Par</td>
                  <td>Cout</td>
                </tr>
              </thead>
              <tbody>
                {data.map((index) => {
                  return (
                    <tr key={index._id}>
                      <td>{index.id}</td>
                      <td>{moment(index.createdAt).format("DD-MM-YYYY")}</td>
                      <td>{index.action.action}</td>
                      <td>{index.depense}</td>
                      <td>{index.savedby}</td>
                      <td>${index.cout}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan={5}>Total</td>
                  <td style={{ fontWeight: "bolder" }}>
                    $
                    {_.reduce(
                      data,
                      function (curr, next) {
                        return curr + next.cout;
                      },
                      0
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

export default ListeCout;
