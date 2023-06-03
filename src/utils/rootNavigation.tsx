import {
  CommonActions,
  createNavigationContainerRef,
  StackActions
} from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function getState() {
  if (navigationRef.isReady()) {
    return navigationRef.getState();
  }
  return null;
}

export function navigate(name:any, params:any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

export function replace(name:any, params:any) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(name, params));
  }
}
/**
 *
 * @param {[{name, params}]} routes
 * @param {*} index
 */
export function reset(routes = [], index = routes.length - 1) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes
      })
    );
  }
}

export function popToTop() {
  try {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.popToTop());
    }
  } catch (error) {}
}
