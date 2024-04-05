/* eslint-disable react/prop-types */
import React from 'react';
import moment from 'moment';
import './chat.css';
// eslint-disable-next-line prettier/prettier

function Chat({ demandes }) {
  return (
    <div className="chats">
      {demandes &&
        demandes.length > 0 &&
        demandes.map((index) => {
          return (
            <div key={index._id} className={index.sender === 'co' ? 'co' : 'agent'}>
              <p>{index.message}</p>
              <p style={{ fontSize: '11px' }}>
                <span style={{ textAlign: 'center' }}>{index.codeAgent}</span>
                <span style={{ float: 'right' }}>{moment(index.createdAt).fromNow()}</span>
              </p>
            </div>
          );
        })}
    </div>
  );
}

export default Chat;
