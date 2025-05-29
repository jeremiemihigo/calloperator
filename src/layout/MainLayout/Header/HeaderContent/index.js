// material-ui
import { Box, useMediaQuery } from "@mui/material";

// project import
import { useSelector } from "react-redux";
import Connected from "./Connected";
import MobileSection from "./MobileSection";
import Profile from "./Profile";
import MyNotification from "./Profile/MyNotification";
import Search from "./Search";
// import Solde from "./Solde";

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const user = useSelector((state) => state.user?.user);
  return (
    <>
      {!matchesXs && <Search />}
      <MyNotification />
      {/* <Solde /> */}
      {matchesXs && <Box sx={{ width: "100%", ml: 1 }} />}
      {user && user?.fonction === "superUser" && <Connected />}
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
