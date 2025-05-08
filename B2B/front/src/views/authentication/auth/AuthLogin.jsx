import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

import axios from "axios";
import CustomTextField from "../../../components/forms/theme-elements/CustomTextField";
import { lien } from "../../../Static/Lien";

const AuthLogin = ({ title, subtitle, subtext }) => {
  const [initiale, setInitiale] = React.useState();
  const onchange = (event) => {
    const { name, value } = event.target;
    setInitiale({
      ...initiale,
      [name]: value,
    });
  };
  const [message, setMessage] = React.useState("");
  const sending = async () => {
    try {
      const response = await axios.post(lien + "/login", initiale);
      if (response.status === 200) {
        localStorage.setItem("auth", response.data);
        window.location.replace("/projets");
      } else {
        setMessage(response.data);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };
  return (
    <>
      <Stack>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="username"
            mb="5px"
          >
            Username
          </Typography>
          <CustomTextField
            name="username"
            onChange={(event) => onchange(event)}
            id="username"
            variant="outlined"
            fullWidth
          />
        </Box>
        <Box mt="25px">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="password"
            mb="5px"
          >
            Password
          </Typography>
          <CustomTextField
            id="password"
            type="password"
            name="password"
            onChange={(event) => onchange(event)}
            variant="outlined"
            fullWidth
          />
        </Box>
        <Stack
          justifyContent="space-between"
          direction="row"
          alignItems="center"
          my={2}
        >
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Remeber this Device"
            />
          </FormGroup>
        </Stack>
      </Stack>
      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={() => sending()}
          type="submit"
        >
          Sign In
        </Button>
      </Box>
      <p
        style={{
          padding: "0px",
          textAlign: "center",
          margin: "0px",
          color: "red",
        }}
      >
        {message}
      </p>
    </>
  );
};

export default AuthLogin;
