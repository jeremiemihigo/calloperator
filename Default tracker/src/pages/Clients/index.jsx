import { Paper } from '@mui/material';
import Objectif from 'pages/Objectif';
import './style.css';
import UploadClient from './Upload';

export default function index() {
  return (
    <>
      <Paper elevation={3} sx={{ padding: '10px' }}>
        <UploadClient />
      </Paper>
      <Paper elevation={3} sx={{ padding: '10px', margin: '10px 0px' }}>
        <Objectif />
      </Paper>
    </>
  );
}
