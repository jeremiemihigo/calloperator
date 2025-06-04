import { Typography } from "@mui/material";
import "./detail.style.css";

function Plus({ data }) {
  return (
    <div className="plus">
      {data?.responsable && (
        <>
          <Typography component="p" className="plus_title">
            Responsable
          </Typography>
          <Typography component="p" className="plus_value">
            {data?.responsable}
          </Typography>
        </>
      )}
      <Typography component="p" className="plus_title">
        Contact
      </Typography>
      <Typography component="p" className="plus_value">
        {data?.contact}
      </Typography>
      <Typography component="p" className="plus_title">
        Email
      </Typography>
      <Typography component="p" className="plus_value">
        {data?.email}
      </Typography>
      <Typography component="p" className="plus_title">
        Adresse
      </Typography>
      <Typography component="p" className="plus_value">
        {data?.adresse}
      </Typography>
      <Typography component="p" className="plus_title">
        En charge
      </Typography>
      <Typography component="p" className="plus_value">
        {data?.suivi_par}
      </Typography>
    </div>
  );
}

export default Plus;
