import { useNavigate } from 'react-router-dom';
import './logo.style.css';

function Index() {
  const navigation = useNavigate();
  const handleclick = () => {
    navigation('/');
  };
  return (
    <div className="logo_one" onClick={() => handleclick()}>
      <div className="logo">
        <p className="bboxx">BBOXX-DRC</p>
        <p className="dt">Default tracker</p>
      </div>
    </div>
  );
}

export default Index;
