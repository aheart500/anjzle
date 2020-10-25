import Articles from "./assets/images/articles.jpeg";
import Translation from "./assets/images/translation.jpeg";
import Researches from "./assets/images/researches.jpeg";
import Privacy from "./assets/images/privacy.jpeg";
import PP from "./assets/images/pp.jpeg";
import Reports from "./assets/images/reports.jpeg";
import Contact from "./assets/images/contact.jpeg";
import Who from "./assets/images/who.jpeg";
import Constants from "expo-constants";
import { I18nManager } from "react-native";
export const isArabic = I18nManager.isRTL;
export const colors = {
  primary: "#6493de",
};
export const barHeight = Constants.statusBarHeight;
const dev = false;
const dev_port = 3003
const absolute_base = dev ? "http://192.168.1.2:"+ dev_port : "https://anjzle.com";
const api_base = dev
  ? "http://192.168.1.2:"+ dev_port+"/mobile"
  : "https://anjzle.com/mobile";

export const api = {
  api_base,
  getUsers: api_base + "/users",
  login: api_base + "/users/login",
  register: api_base + "/users",
  resendCode: api_base + "/users/resendCode",
  updatePassword: api_base + "/users/updatePassword",
  getUser: api_base + "/users/user",
  getDeps: api_base + "/deps",
  getServices: (dep_id) => api_base + "/services/" + dep_id,
  services: api_base + "/services/",
  addOrder: api_base + "/orders",
  messages: api_base + "/msgs",
  uploads: absolute_base + "/uploads",
  contacts: api_base + "/contacts",
  payments: api_base + "/payments",

};
export const images = {
  Articles,
  Translation,
  Researches,
  Privacy,
  PP,
  Reports,
  Contact,
  Who,
};
