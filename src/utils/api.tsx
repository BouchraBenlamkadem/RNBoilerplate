import { ENV } from "_constants";
import axios from "axios";

export const TIMEOUT = 10 * 1000; // 10s
export const EXTENDEDTIMEOUT = 30 * 1000; // 30s

export const API_PATH = ENV.API;

const QUERY = async (
  method:string,
  api_path = API_PATH,
  path:string,
  options:any = {},
  timeoutExtended = false,
  hasFormData = false
) => {
  const { token, ..._options } = options;
  console.log("=================Axios==============", api_path + path);
  try {
    let source = axios.CancelToken.source();
    setTimeout(() => source.cancel(), timeoutExtended ? EXTENDEDTIMEOUT : TIMEOUT);
    const result = hasFormData
      ? await axios.post(api_path + path, _options.data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer-${token}` : null
          },
          transformRequest: (data, headers) => {
            return _options.data;
          }
        })
      : await axios.request({
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer-${token}` : null
          },
          cancelToken: source.token,
          url: api_path + path,
          ..._options
        });

    return result?.data;
  } catch (error: any) {
    console.log(`__________ API ${method} ERROR @ ${path} : `, error);
    const timeout_error = error.constructor?.name == "CanceledError";
    const network_error = !error.response?.status;
    const result = {
      message: {
        fr: timeout_error
          ? "Le serveur a mis du temps pour répondre"
          : network_error
          ? "Merci de se connecter à Internet."
          : "Un problème technique est survenu"
      },
      success: false,
      network_error
    };
    return result;
  }
};

/**
 *
 * @param {string} path
 * @param {{params:{},...}} options
 * @returns
 */
export const GET = async (
  path:string,
  options = {},
  timeoutExtended = false,
  hasFormData = false,
  api_path = API_PATH
) => {
  return await QUERY("GET", api_path, path, options, timeoutExtended, hasFormData);
};

/**
 *
 * @param {string} path
 * @param {{params:{},auth:{}}} options
 * @returns
 */
export const POST = async (
  path:string,
  options = {},
  timeoutExtended = false,
  hasFormData = false,
  api_path = API_PATH
) => {
  return await QUERY("POST", api_path, path, options, timeoutExtended, hasFormData);
};
