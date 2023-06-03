import Navigation from "navigations";
import { default as React, useEffect, useState } from "react";
import SplashScreen from "react-native-splash-screen";
import { Provider } from "react-redux";
import store from "store";
import Initiator from "./Initiator";

import { decode, encode } from "base-64";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const App = () => {
  const [dataReady, setDataReady] = useState(false);
  const [initialPage, setInitialPage] = useState(null);

  useEffect(() => {
    dataReady && initialPage && SplashScreen.hide();
  }, [dataReady, initialPage]);

  return (
    <Provider store={store}>
      <Initiator setDataReady={setDataReady} setInitialPage={setInitialPage}>
        {initialPage && <Navigation initialPage={initialPage} />}
      </Initiator>
    </Provider>
  );
};

export default App;
