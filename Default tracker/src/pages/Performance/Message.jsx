import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import React from 'react';
import { Paper } from '../../../node_modules/@mui/material/index';
import moment from '../../../node_modules/moment/moment';
import { CreateContextePerformance } from './Context';

function MessageComponent() {
  const { result } = React.useContext(CreateContextePerformance);
  return (
    <div>
      {result &&
        result.length > 0 &&
        result.map((index) => {
          return (
            <div key={index._id}>
              <Paper elevation={2} className="elevation_name">
                <p className="concerne">{index.concerne}</p>
                <p className="message">{index.message}</p>
                <div className="footer">
                  <p className="moment">{moment(index.createdAt).fromNow()}</p>
                  {index.vu ? <DoneIcon fontSize="small" /> : <DoneAllIcon sx={{ color: 'blue' }} fontSize="small" />}
                </div>
              </Paper>
            </div>
          );
        })}
    </div>
  );
}

export default MessageComponent;
