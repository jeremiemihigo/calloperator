type Props = {
  type: "Loading" | "page";
};
function Loading({ type }: Props) {
  return (
    <>
      {type === "Loading" && (
        <div className="w-screen">
          <p className="text-center ">Loading...</p>
        </div>
      )}
    </>
  );
}

export default Loading;
