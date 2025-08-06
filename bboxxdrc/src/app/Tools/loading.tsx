type Props = {
  type: "Loading" | "page";
};
function Loading({ type }: Props) {
  const imageLoad = "https://pulse.bboxx.com/v2/assets/animations/loader.gif";
  return (
    <>
      {type === "Loading" && <div className="w-screen spinner "></div>}
      {type === "page" && (
        <div className="firstloading">
          <img src={imageLoad} alt="Loadingpage" />
        </div>
      )}
    </>
  );
}

export default Loading;
