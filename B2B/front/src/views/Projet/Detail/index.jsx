import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import _ from "lodash";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import AddActionForm from "./AddAction.jsx";
import "./detail.style.css";

const DetailsProjet = () => {
  const location = useLocation();
  const { state } = location;
  const navigation = useNavigate();

  const steps = useSelector((state) => state.steps.step);
  const returnStep = (id) => {
    return _.filter(steps, { id })[0]?.title;
  };
  const [data, setData] = React.useState();

  React.useEffect(() => {
    if (state) {
      setData(state);
    } else {
      navigation("/projets");
    }
  }, [state]);

  return (
    <>
      <Paper className="papier_projet" elevation={3}>
        <Typography component="p" className="titre_projet">
          {data && data?.designation}
        </Typography>
        <Typography component="p" className="description_projet">
          {data && data?.description}
        </Typography>
        {data?.responsable && (
          <Typography component="p" className="autres_projet">
            <span>Responsable</span> : {data?.responsable}
          </Typography>
        )}
        <Typography component="p" className="autres_projet">
          <span>Contact : </span> {data?.contact}
        </Typography>
        <Typography component="p" className="autres_projet">
          <span>Email : </span>
          {data?.email}
        </Typography>
        <Typography component="p" className="autres_projet">
          <span>Adresse : </span>
          {data?.adresse}
        </Typography>
        <Typography component="p" className="autres_projet">
          <span>En charge : </span>
          {data?.suivi_par}
        </Typography>
      </Paper>
      <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
        {data &&
        steps &&
        steps.length > 0 &&
        data.actions &&
        data.actions.length > 0 ? (
          <Table
            aria-label="simple table"
            sx={{
              whiteSpace: "nowrap",
              mt: 2,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Saved By
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Actions effectuées
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Last step
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Next step
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Deedline
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.actions.length > 0 &&
                data.actions.map((action, key) => {
                  return (
                    <TableRow key={action._id}>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {action.savedBy}
                            </Typography>
                            <Typography
                              color="textSecondary"
                              sx={{
                                fontSize: "13px",
                              }}
                            >
                              {moment(action.dateSave).fromNow()}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          color="textSecondary"
                          variant="subtitle2"
                          fontWeight={400}
                        >
                          {action.action}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          color="textSecondary"
                          variant="subtitle2"
                          fontWeight={400}
                        >
                          {returnStep(action.statut_actuel)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          color="textSecondary"
                          variant="subtitle2"
                          fontWeight={400}
                        >
                          {returnStep(action.next_step)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          color="textSecondary"
                          variant="subtitle2"
                          fontWeight={400}
                          sx={{
                            color:
                              action.deedline === "IN SLA" ? "green" : "red",
                          }}
                        >
                          {action.deedline ? action.deedline : "Pending"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        ) : (
          <p
            style={{
              color: "red",
              textAlign: "center",
              fontWeight: "bolder",
            }}
          >
            Aucune action trouvée
          </p>
        )}
      </Box>

      <Paper sx={{ padding: "10px" }}>
        <AddActionForm data={data} setData={setData} />
      </Paper>
    </>
  );
};

export default DetailsProjet;
