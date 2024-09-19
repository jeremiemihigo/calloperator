import { FileCopy } from '@mui/icons-material';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx';

// eslint-disable-next-line react/prop-types
function ExcelButton({ data_now, data_two, fileName }) {
  const downloadExcel = () => {
    const worksheet1 = XLSX.utils.json_to_sheet(data_now);
    const worksheet2 = XLSX.utils.json_to_sheet(data_two);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet1, 'to day');
    XLSX.utils.book_append_sheet(workbook, worksheet2, 'last day');
    XLSX.writeFile(workbook, fileName);
  };
  return (
    <>
      <Button color="success" variant="contained" fullWidth disabled={data_now ? false : true} onClick={() => downloadExcel()}>
        <FileCopy fontSize="small" />
      </Button>
    </>
  );
}

export default ExcelButton;
