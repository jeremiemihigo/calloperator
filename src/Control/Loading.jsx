import { puls_img } from 'static/Lien';

function LoadingImage() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src={puls_img} alt="chargement_image" />
    </div>
  );
}

export default LoadingImage;
