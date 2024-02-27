import { FileCopy } from '@mui/icons-material';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx';

// eslint-disable-next-line react/prop-types
function ExcelButton({ data, title, fileName }) {
  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, fileName);
  };
  return (
    <>
      <Button
        color="success"
        sx={{ marginLeft: '5px' }}
        variant="contained"
        disabled={data ? false : true}
        onClick={() => downloadExcel(data)}
      >
        <FileCopy fontSize="small" /> <span className="ml-2">{title}</span>
      </Button>
    </>
  );
}

export default ExcelButton;
