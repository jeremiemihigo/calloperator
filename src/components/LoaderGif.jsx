import PropTypes from "prop-types";
import { puls_img } from "static/Lien";

function LoaderGif({ width, height }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img width={width} height={height} src={puls_img} alt="Loading" />
    </div>
  );
}
LoaderGif.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
export default LoaderGif;
