import HeaderComponent from "./header/Header";

function NotFound() {
  return (
    <HeaderComponent title="Not found">
      {" "}
      <div id="errorMessage">
        <div>
          <h2>404</h2>
          <h1 className="notFoundTitle">Oops! That page can’t be found.</h1>
          <p className="notFoundDesc">
            It looks like nothing was found at this location. Maybe try one of
            the links in the menu.
          </p>
        </div>
      </div>
    </HeaderComponent>
  );
}

export default NotFound;
