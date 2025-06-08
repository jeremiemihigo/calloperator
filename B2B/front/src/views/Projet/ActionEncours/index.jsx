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
import { Grid } from "@mui/system";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import DashboardCard from "src/components/shared/DashboardCard";
import { lien_file } from "src/static/Lien";
import { config, lien } from "src/static/Lien.js";
import "../Detail/detail.style.css";

const ActionEnCours = () => {
  const data = useSelector((state) => state.action.action);
  console.log(data);
  const closeProcess = async (id) => {
    try {
      const response = await axios.post(`${lien}/closeaction`, { id }, config);
      if (response.status === 200) {
        window.location.replace("/action_en_cours");
      } else {
        alert(JSON.stringify(response.data));
      }
    } catch (error) {
      alert(JSON.stringify(error.message));
    }
  };

  return (
    <>
      <DashboardCard title="Toutes les actions en cours"></DashboardCard>
      <Grid container>
        <Grid size={{ lg: 12 }}>
          <Paper
            elevation={2}
            sx={{
              overflow: "auto",
              marginTop: "10px",
              width: { xs: "280px", sm: "auto" },
            }}
          >
            {data && data.length > 0 ? (
              <Table
                aria-label="simple table"
                sx={{
                  whiteSpace: "nowrap",
                  mt: 2,
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "10%" }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                      ></Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Projet or prospect
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
                        Commentaire
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Process
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
                  {data.map((action, key) => {
                    return (
                      <TableRow key={key}>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Box>
                              <Typography variant="subtitle2" fontWeight={600}>
                                Saved by {action.savedBy}
                              </Typography>
                              <Typography
                                color="textSecondary"
                                sx={{
                                  fontSize: "13px",
                                }}
                              >
                                {moment(action.dateSave).format(
                                  "dddd DD-MM-YYYY"
                                )}
                              </Typography>
                              <Typography
                                color="textSecondary"
                                sx={{
                                  fontSize: "13px",
                                }}
                              >
                                {action.filename &&
                                  action.filename.length > 0 &&
                                  action.filename.map((index) => {
                                    return (
                                      <div key={index._id}>
                                        <a
                                          rel="noreferrer"
                                          target="_blank"
                                          className="pfilename"
                                          href={`${lien_file}/${index.namedb}`}
                                          download={index.originalname}
                                        >
                                          <span> {index.originalname}</span>
                                        </a>
                                      </div>
                                    );
                                  })}
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
                            {action.projet.length > 0 &&
                              action.projet[0].designation}
                            {action.prospect.length > 0 &&
                              action.prospect[0].name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            {action.statut_actuel}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            {action.next_step}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            className="insla"
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            {action?.commentaire}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            className="insla"
                            onClick={() => closeProcess(action._id)}
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            {action?.type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            {action?.type === "CLOSE" ? (
                              <span
                                className={
                                  action.sla === "IN SLA" ? "insla" : "outsla"
                                }
                              >
                                {action.sla}
                              </span>
                            ) : (
                              moment(action.deedline).format("ddd DD-MM-YYYY")
                            )}
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
                Aucune action en cours
              </p>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default ActionEnCours;
