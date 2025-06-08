import ExcelIcon from 'assets/excelicon.jpg';
import './style.css';

function ChangeByExcel({ texte, ...other }) {
  return (
    <div {...other} className="usexlsx" style={{ marginLeft: '10px' }}>
      <div style={{ display: 'flex', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}>
        <img src={ExcelIcon} alt="Excel icon" width={30} height={20} style={{ marginRight: '4px' }} />
        <p style={{ padding: '0px', margin: '0px', fontSize: '12px' }}>{texte}</p>
      </div>
    </div>
  );
}

export default ChangeByExcel;
