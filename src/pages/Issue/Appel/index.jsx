import React from 'react';
import App from './App';
import Contexte from './Contexte';
function Index() {
  return (
    <Contexte>
      <App />
    </Contexte>
  );
}

export default React.memo(Index);
