import ExcelIcon from 'assets/excelicon.jpg';
import * as XLSX from 'xlsx';
import './style.css';
function ExcelFile({ fileName, data }) {
  const StructureDataExcel = (e) => {
    e.preventDefault();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DT');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  return (
    <div className="usexlsx" onClick={(e) => StructureDataExcel(e)} style={{ marginLeft: '10px' }}>
      <div style={{ display: 'flex', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}>
        <img src={ExcelIcon} alt="Excel icon" width={30} height={20} style={{ marginRight: '4px' }} />
        <p style={{ padding: '0px', margin: '0px', fontSize: '12px' }}>Export in Excel</p>
      </div>
    </div>
  );
}

export default ExcelFile;
