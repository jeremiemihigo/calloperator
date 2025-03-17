import * as XLSX from "xlsx";
import { Grid } from "../../node_modules/@mui/material/index";
import "./Excel.style.css";
import ExcelIcon from "./excelicon.jpg";

// eslint-disable-next-line react/prop-types
function ExcelButton({ data, title, fileName }) {
  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "File");
    XLSX.writeFile(workbook, fileName);
  };
  return (
    <Grid
      className="divbtonExcel"
      onClick={() => {
        data && downloadExcel(data);
      }}
    >
      <img width={20} height={20} src={ExcelIcon} alt="Excel_icon" />
      <span>{title}</span>
    </Grid>
  );
}

export default ExcelButton;
