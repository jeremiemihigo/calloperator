import { Add } from "@mui/icons-material";
import { Button, Grid, TextField } from "@mui/material";
import _ from "lodash";
import React from "react";

function Solde() {
  const [initiale, setInitiale] = React.useState({ item: "", dailyrate: "" });
  const [allitem, setAllItem] = React.useState([]);
  const onchange = (event) => {
    const { name, value } = event.target;
    setInitiale({
      ...initiale,
      [name]: value,
    });
  };
  const AddItem = (event) => {
    event.preventDefault();
    setAllItem([...allitem, { ...initiale, id: allitem.length + 1 }]);
    setInitiale({ dailyrate: "", item: "" });
  };
  console.log(allitem);
  return (
    <>
      <Grid container>
        <Grid item lg={4}>
          <Grid container>
            <Grid item lg={6} sx={{ padding: "3px" }}>
              <TextField
                name="item"
                value={initiale.item}
                onChange={(event) => onchange(event)}
                variant="outlined"
                label="Item"
              />
            </Grid>
            <Grid item lg={4} sx={{ padding: "3px" }}>
              <TextField
                name="dailyrate"
                value={initiale.dailyrate}
                onChange={(event) => onchange(event)}
                variant="outlined"
                label="Daily rate"
                type="number"
              />
            </Grid>
            <Grid
              item
              lg={2}
              sx={{
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={(event) => AddItem(event)}
                variant="contained"
                color="primary"
                fullWidth
              >
                <Add fontSize="small" />
              </Button>
            </Grid>
          </Grid>
          <Grid>
            <table>
              <thead>
                <tr>
                  <td>#</td>
                  <td>Item</td>
                  <td>Dailyrate</td>
                  <td>Prorate</td>
                </tr>
              </thead>
              <tbody>
                {allitem.map((index, key) => {
                  return (
                    <tr key={key}>
                      <td>{key + 1}</td>
                      <td>{index.item}</td>
                      <td>{index.dailyrate}</td>
                      <td>
                        {(
                          (parseFloat(index.dailyrate) * 100) /
                          _.reduce(
                            allitem,
                            function (curr, next) {
                              return curr + parseFloat(next.dailyrate);
                            },
                            0
                          )
                        ).toFixed(1)}
                      </td>
                      <td
                        onClick={() => {
                          setAllItem(allitem.filter((x) => x.id !== index.id));
                        }}
                      >
                        Delete
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td>Total</td>
                  <td>
                    {_.reduce(
                      allitem,
                      function (curr, next) {
                        return curr + parseFloat(next.dailyrate);
                      },
                      0
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default Solde;
