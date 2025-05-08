import { CircularProgress } from "@mui/material";

function LoadingImage() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "5px",
          }}
        >
          <CircularProgress size={20} />
        </div>
        <p style={{ padding: "0px", margin: "0px" }}>Loading...</p>
      </div>
    </div>
  );
}

export default LoadingImage;
