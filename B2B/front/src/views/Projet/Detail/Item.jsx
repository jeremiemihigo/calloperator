import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import { lien_file } from "../../../static/Lien";
import "./detail.style.css";

function Item({ data, onclick }) {
  return (
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
            <Typography variant="subtitle2" fontWeight={600}></Typography>
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
                      {moment(action.dateSave).format("dddd DD-MM-YYYY")}
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
                  {action.action}
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
                  onClick={() => onclick(action._id)}
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
                      className={action.sla === "IN SLA" ? "insla" : "outsla"}
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
  );
}

export default Item;
