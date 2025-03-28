function Question({ texte }) {
  return (
    <>
      <p style={{ fontSize: "17px", marginBottom: "10px" }}>
        {texte}
        <span
          style={{
            color: "red",
            marginLeft: "10px",
            fontSize: "17px",
            fontWeight: "bolder",
          }}
        >
          *
        </span>
      </p>
    </>
  );
}

export default Question;
