import { CreateContexteGlobal } from "GlobalContext";
import _ from "lodash";
import React from "react";
import "./backoffice.css";
import BackofficeComponent from "./BackofficeComponent";

function AllCall() {
  const [data, setData] = React.useState();
  const { client } = React.useContext(CreateContexteGlobal);
  const loading = () => {
    if (client) {
      setData(_.filter(client, { operation: "backoffice" }));
    }
  };
  React.useEffect(() => {
    loading();
  }, [client]);

  return (
    <>
      <BackofficeComponent data={data} analyse={true} />
    </>
  );
}

export default React.memo(AllCall);
