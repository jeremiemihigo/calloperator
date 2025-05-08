import {
  Box,
  Checkbox,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { allpermission } from "../../static/Lien";
import "./user.style.css";

const TableUtilisateurs = () => {
  // select
  const allusers = useSelector((state) => state.alluser.user);

  return (
    <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
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
                Id
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                Name
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                Permissions
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                Statut
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allusers &&
            allusers.map((user, key) => (
              <TableRow key={user._id}>
                <TableCell>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                  >
                    {key + 1}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {user.name}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        sx={{
                          fontSize: "13px",
                        }}
                      >
                        {user.username}
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
                    {user.permission.map((item) => {
                      return (
                        <div className="checkboxx">
                          <p key={item}>
                            {
                              allpermission.filter((x) => x.value === item)[0]
                                .title
                            }
                          </p>
                          <Checkbox checked={true} />
                        </div>
                      );
                    })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    sx={{
                      px: "4px",
                      backgroundColor: user.active
                        ? "secondary.mail"
                        : "primary.main",
                      color: "#fff",
                    }}
                    size="small"
                    label={user.active ? "Actif" : "Bloquer"}
                  ></Chip>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default TableUtilisateurs;
