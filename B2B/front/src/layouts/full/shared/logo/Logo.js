import { styled } from "@mui/material";
import { Link } from "react-router";
import LogoDark1 from "src/assets/images/logos/bboxx.png";

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "180px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled
      to="/"
      height={70}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img src={LogoDark1} height={50} width={50} />
    </LinkStyled>
  );
};

export default Logo;
