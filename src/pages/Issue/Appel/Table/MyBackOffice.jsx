import axios from "axios";
import React from "react";
import { config, lien_issue } from "static/Lien";
import BackofficeComponent from "./BackofficeComponent";

function MyBackOffice() {
  const [data, setData] = React.useState();
  const loading = async () => {
    try {
      const response = await axios.get(lien_issue + "/mybackoffice", config);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, []);

  return (
    <>
      <BackofficeComponent data={data} analyse={false} />
    </>
  );
}

export default React.memo(MyBackOffice);
