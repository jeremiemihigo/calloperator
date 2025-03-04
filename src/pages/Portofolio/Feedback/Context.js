/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext } from 'react';
export const ContextFeedback = createContext();

const Context = (props) => {
  return <ContextFeedback.Provider value={{ name: 120 }}>{props.children}</ContextFeedback.Provider>;
};
export default React.memo(Context);
