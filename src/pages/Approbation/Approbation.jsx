import {
  FormControl,
  Grid,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import axios from "axios";
import NoCustomer from "components/Attente";
import LoadingImage from "Control/Loading";
import React from "react";
import { config, lien } from "static/Lien";
// assets
import { SearchOutlined } from "@ant-design/icons";
import ContentDemande from "./Content";

function Approbation() {
  const [data, setData] = React.useState();

  const [load, setLoad] = React.useState(false);

  const loading = async () => {
    try {
      setLoad(true);
      const response = await axios.get(lien + "/approbation", config);
      if (response.status === 200) {
        setData(response.data);
        setLoad(false);
      }
    } catch (error) {
      setLoad(false);
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, []);

  const [filterFn, setFilterFn] = React.useState({
    fn: (items) => {
      return items;
    },
  });
  const onchange = (event) => {
    setFilterFn({
      fn: (items) => {
        if (event.target.value === "") {
          return items;
        } else {
          return items.filter((x) =>
            x.codeAgent.toUpperCase().includes(event.target.value.toUpperCase())
          );
        }
      },
    });
  };
  return (
    <div>
      {load && <LoadingImage />}
      {!load && data && data.length === 0 && (
        <NoCustomer texte="No pending approval requests from you" />
      )}
      {!load && data && data.length > 0 && (
        <FormControl sx={{ width: "100%", marginBottom: "5px" }}>
          <OutlinedInput
            size="small"
            id="header-search"
            startAdornment={
              <InputAdornment position="start" sx={{ mr: -0.5 }}>
                <SearchOutlined />
              </InputAdornment>
            }
            aria-describedby="header-search-text"
            inputProps={{
              "aria-label": "weight",
            }}
            onChange={(e) => onchange(e)}
            placeholder={`Search ID agent ${data.length} visite(s)`}
          />
        </FormControl>
      )}
      {!load && data && data.length > 0 && (
        <Grid container>
          {data && (
            <>
              {filterFn.fn(data).map((items) => {
                return (
                  <Grid
                    item
                    lg={3}
                    md={4}
                    sm={4}
                    xs={12}
                    key={items._id}
                    sx={{ padding: "3px" }}
                  >
                    <ContentDemande
                      item={items}
                      data={data}
                      setData={setData}
                    />
                  </Grid>
                );
              })}
            </>
          )}
        </Grid>
      )}
    </div>
  );
}

export default Approbation;
