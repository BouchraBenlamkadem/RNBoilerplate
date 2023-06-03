import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key:string, value:any, withUser = false) => {
  try {
    let user = null;
    if (withUser) user = await getData("user");
    // Doesn't store data that's related to a user if user is null :
    if (withUser && !user) return; 
    const _key = user ? key + "-" + user.id_dsmi : key;
    const _value = typeof value != "string" ? JSON.stringify(value) : value;
    value ? await AsyncStorage.setItem(_key, _value) : await AsyncStorage.removeItem(_key);
  } catch (e) {
  }
};

export const getData = async (key:string, withUser = false, parse = true) => {
  try {
    let user = null;
    if (withUser) user = await getData("user");
    const _key = user ? key + "-" + user.id_dsmi : key;
    const _value = await AsyncStorage.getItem(_key);
    return _value != null ? (parse ? JSON.parse(_value) : _value) : null;
  } catch (e) {
  }
};
