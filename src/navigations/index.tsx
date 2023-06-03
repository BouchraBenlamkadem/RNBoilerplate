import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { Alert, Loader, Message } from "components";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as screens from "screens";
import { rootNavigation } from "utils";

const Stack = createNativeStackNavigator();

const MainNavigatorConfig = {
  header: null,
  headerMode: "none",
  screenOptions: { headerShown: false }
};

function RootStack({ initialPage }:any) {
  return (
    <Stack.Navigator {...MainNavigatorConfig} initialRouteName={initialPage ?? "Home"}>
      {Object.entries(screens).map(([screen, component]:any) => (
        <Stack.Screen key={screen} name={screen} component={component} />
      ))}
    </Stack.Navigator>
  );
}

export default function Navigator({ initialPage }:any) {
  const isLoading = useSelector((state:any) => state.info.loading.length > 0);
  const globalAlerts = useSelector((state:any) => state.info.alerts);
  const messages = useSelector((state:any) => state.info.messages);
  const dispatch = useDispatch();

  return (
    <NavigationContainer ref={rootNavigation.navigationRef}>
      <RootStack initialPage={initialPage} />
      {/* <Message messages={messages} />
      {isLoading && <Loader />}
      {globalAlerts.length > 0 &&
        globalAlerts.map(
          (globalAlert:any, index:any) =>
            !!globalAlert &&
            !globalAlert?.hidden && (
              <Alert
                key={index}
                icon={globalAlert.icon}
                text={globalAlert.text}
                isWarning={globalAlert.isWarning}
                cancelText={globalAlert.cancelText}
                confirmText={globalAlert.confirmText}
                isVisible={globalAlert !== null}
                onConfirm={() => {
                  globalAlert.onConfirm && globalAlert.onConfirm();
                }}
                onCancel={() => {
                  globalAlert.onCancel && globalAlert.onCancel();
                }}
                onDone={() => {
                  dispatch(InfoSlice.default.actions.removeAlert(index));
                  globalAlert.onDone && globalAlert.onDone();
                }}
              />
            )
        )} */}
    </NavigationContainer>
  );
}
