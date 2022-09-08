import React from "react";
import "./../styles/global.scss";
import NavbarCustom from "./../components/NavbarCustom";
import IndexPage from "./index";
import AboutPage from "./about";
import FaqPage from "./faq";
import DashboardPage from "./dashboard";
import SettingsPage from "./settings";
import AuthPage from "./auth";
import SetBlockPage from "./set-block";
import BlockPage from "./block";
import FeaturePage from './feature'
import { Switch, Route, Router } from "./../util/router.js";
import NotFoundPage from "./not-found.js";
import Footer from "./../components/Footer";
import "./../util/analytics.js";
import { ProvideAuth } from "./../util/auth.js";

function App(props) {
  return (
    <ProvideAuth>
      <Router>
        <>
          <NavbarCustom
            bg="primary"
            variant="dark"
            expand="md"
            logo="https://uploads.divjoy.com/logo-white.svg"
          />

          <Switch>
            <Route exact path="/" component={IndexPage} />

            <Route exact path="/set-block" component={SetBlockPage} />
            <Route exact path="/block/:id" component={BlockPage} />
            <Route exact path="/feature/:blockId/:id" component={FeaturePage} />


            <Route exact path="/about" component={AboutPage} />

            <Route exact path="/faq" component={FaqPage} />

            <Route exact path="/dashboard" component={DashboardPage} />

            <Route exact path="/settings/:section" component={SettingsPage} />

            <Route exact path="/auth/:type" component={AuthPage} />

            <Route component={NotFoundPage} />
          </Switch>

          <Footer
            bg="white"
            textColor="dark"
            size="md"
            bgImage=""
            bgImageOpacity={1}
            description="A short description of what you do here"
            copyright="© 2019 Company"
            logo="https://uploads.divjoy.com/logo.svg"
          />
        </>
      </Router>
    </ProvideAuth>
  );
}

export default App;
