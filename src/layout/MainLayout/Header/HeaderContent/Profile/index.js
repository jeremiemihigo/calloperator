import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

// material-ui
import {
  Avatar,
  Box,
  ButtonBase,
  CardContent,
  ClickAwayListener,
  Grid,
  IconButton,
  Paper,
  Popper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// project import
import userImage from "assets/images/users/user.svg";
import Transitions from "components/@extended/Transitions";
import MainCard from "components/MainCard";
import { Link } from "react-router-dom";
import ProfileTab from "./ProfileTab";
import Setting_Call from "./Setting_Call";
// assets
import { LogoutOutlined } from "@ant-design/icons";
// import {  RedoOutlined } from '@ant-design/icons';
import { Person, Settings } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { returnName } from "static/Lien";
// import Ticket from './Ticket';

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    "aria-controls": `profile-tabpanel-${index}`,
  };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  const theme = useTheme();
  const navigation = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("auth");
    navigation("/login");
    // window.location.replace('/login');
  };

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const iconBackColorOpen = "grey.300";
  const userConnect = useSelector((state) => state.user);

  useEffect(() => {
    if (
      userConnect &&
      userConnect.readUser !== "success" &&
      userConnect.user === undefined
    ) {
      localStorage.removeItem("auth");
      window.location.replace("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userConnect]);

  const retourFonction = (text) => {
    if (text === "superUser") {
      return "Super utilisateur";
    }
    if (text === "admin") {
      return "Administrateur";
    }
    if (text === "co") {
      return "Call Operator";
    }
    return "";
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : "transparent",
          borderRadius: 1,
          "&:hover": { bgcolor: "secondary.lighter" },
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? "profile-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
          {userConnect?.user && (
            <Avatar
              alt="profile user"
              src={userConnect.user.filename || userImage}
              component={Link}
              to="/image_profile"
              sx={{ width: 32, height: 32 }}
            />
          )}
          <Typography variant="subtitle1">
            {returnName(userConnect?.user?.nom)}
          </Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            {open && (
              <Paper
                sx={{
                  boxShadow: theme.customShadows.z1,
                  width: 290,
                  minWidth: 240,
                  maxWidth: 290,
                  [theme.breakpoints.down("md")]: {
                    maxWidth: 250,
                  },
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MainCard elevation={0} border={false} content={false}>
                    <CardContent sx={{ px: 2.5, pt: 3 }}>
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item>
                          <Stack
                            direction="row"
                            spacing={1.25}
                            alignItems="center"
                          >
                            {userConnect?.user && (
                              <Avatar
                                alt="profile user"
                                component={Link}
                                to="/image_profile"
                                src={userConnect.user.filename || userImage}
                                sx={{ width: 32, height: 32 }}
                              />
                            )}
                            <Stack>
                              <Typography variant="h6">
                                Call center support
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {retourFonction(userConnect?.user.fonction)}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item>
                          <IconButton
                            size="large"
                            color="secondary"
                            onClick={handleLogout}
                          >
                            <LogoutOutlined />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                    {open && (
                      <>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                          <Tabs
                            variant="fullWidth"
                            value={value}
                            onChange={handleChange}
                            aria-label="profile tabs"
                          >
                            <Tab
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                textTransform: "capitalize",
                              }}
                              icon={
                                <Person
                                  style={{
                                    marginBottom: 0,
                                    marginRight: "10px",
                                  }}
                                />
                              }
                              label="Profil"
                              {...a11yProps(0)}
                            />
                            <Tab
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                textTransform: "capitalize",
                              }}
                              icon={
                                <Settings
                                  style={{
                                    marginBottom: 0,
                                    marginRight: "10px",
                                  }}
                                />
                              }
                              label="Setting"
                              {...a11yProps(1)}
                            />
                          </Tabs>
                        </Box>
                        <TabPanel value={value} index={0} dir={theme.direction}>
                          <ProfileTab handleLogout={handleLogout} />
                        </TabPanel>
                        <TabPanel value={value} index={1} dir={theme.direction}>
                          <Setting_Call handleLogout={handleLogout} />
                        </TabPanel>
                      </>
                    )}
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            )}
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;
