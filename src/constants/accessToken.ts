import Cookies from "js-cookie";
import { tokenKey } from "./tokenKey";

export const accessToken = Cookies.get(tokenKey);
