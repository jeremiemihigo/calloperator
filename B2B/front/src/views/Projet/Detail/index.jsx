import {
  Box,
  Button,
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
import DashboardCard from "src/components/shared/DashboardCard";
import Popup from "src/static/Popup";
import AddAction from "../AddAction";
import "../projet.style.css";

const DetailsProjet = () => {
  const location = useLocation();
  const { state } = location;
  const navigation = useNavigate();

  const [open, setOpen] = React.useState(false);
  const steps = useSelector((state) => state.steps.step);
  const returnStep = (id) => {
    return _.filter(steps, { id })[0]?.title;
  };
  const projets = useSelector((state) => state.projet.projet);
  const [data, setData] = React.useState();

  React.useEffect(() => {
    if (state) {
      setData(_.filter(projets, { id: state.id })[0]);
    } else {
      navigation("/projets");
    }
  }, [state, projets]);

  return (
    <>
      <DashboardCard
        title={data && data?.designation}
        subtitle={data && data?.description}
        action={
          <Button
            onClick={() => setOpen(true)}
            color="primary"
            variant="contained"
          >
            Event
          </Button>
        }
      >
        <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
          {data &&
            steps &&
            steps.length > 0 &&
            data.actions &&
            data.actions.length > 0 && (
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
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
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
                                  action.deedline === "IN SLA"
                                    ? "green"
                                    : "red",
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
            )}
        </Box>
      </DashboardCard>
      {state && (
        <Popup open={open} setOpen={setOpen} title="Add an action">
          <AddAction projetSelect={state} />
        </Popup>
      )}
    </>
  );
};

export default DetailsProjet;
