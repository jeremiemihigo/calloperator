import Loader from 'assets/images/icons/loader.gif';
import PropTypes from 'prop-types';

function LoaderGif({ width, height }) {
  return (
    <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', width: '100%' }}>
      <img width={width} height={height} src={Loader} alt="Loading" />
    </div>
  );
}
LoaderGif.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
};
export default LoaderGif;
