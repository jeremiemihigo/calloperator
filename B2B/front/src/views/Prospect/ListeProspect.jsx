import {
  Box,
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

function ListeProspect({ donner }) {
  const location = useLocation();
  const data = location?.state ? location.state : donner;
  const steps = useSelector((state) => state.steps.step);
  const returnStep = (id) => {
    return _.filter(steps, { id })[0]?.title;
  };
  const navigation = useNavigate();
  const clickCommentaire = (prospect, event) => {
    event.preventDefault();
    navigation("/commentaire", { state: { data: prospect, type: "prospect" } });
  };
  return (
    <div>
      <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
        {data && steps && steps.length > 0 && data.length > 0 && (
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
                    Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Description
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Projet
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Next step
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((prospect, key) => {
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
                            {prospect.savedBy}
                          </Typography>
                          <Typography
                            color="textSecondary"
                            sx={{
                              fontSize: "13px",
                            }}
                          >
                            {prospect.statut}{" "}
                            {moment(prospect.createdAt).fromNow()}
                          </Typography>
                          <Typography
                            color="textSecondary"
                            sx={{
                              fontSize: "10px",
                            }}
                            onClick={(event) =>
                              clickCommentaire(prospect, event)
                            }
                          >
                            Comment
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
                        {prospect.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="subtitle2"
                        fontWeight={400}
                      >
                        {prospect.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="subtitle2"
                        fontWeight={400}
                      >
                        {prospect.projet.length > 0
                          ? prospect.projet[0].designation
                          : ""}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="subtitle2"
                        fontWeight={400}
                      >
                        {returnStep(prospect.next_step)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Box>
    </div>
  );
}

export default ListeProspect;
