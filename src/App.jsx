import { Provider } from "react-redux";
import { persistedStore } from "../src/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { Outlet } from "react-router-dom";
import store from "../src/store/store";
import SocketInitializer from "./socket/socketIntialize";
import { SocketContext, socket } from "./socket/socketContext";

const App = () => {
  return (
    <div>
      <SocketContext.Provider value={socket}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistedStore}>
            <SocketInitializer />
            <Outlet />
          </PersistGate>
        </Provider>
      </SocketContext.Provider>
    </div>
  );
};

export default App;
