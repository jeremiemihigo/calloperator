// project import
import ScrollTop from "components/ScrollTop";
import Routes from "routes";
import ThemeCustomization from "themes";

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <ThemeCustomization>
    <ScrollTop>
      <Routes />
    </ScrollTop>
  </ThemeCustomization>
);

export default App;
