import axios from "axios";
import { createBrowserHistory } from "history";
import { error } from "console";
// import { openNotificationWithIcon } from "../lib/Nontification";
import { store } from "../redux/configStore";
import { openNotificationWithIcon } from "../utils/lib/Nontification";
import { setLoading } from "../redux/reducer/LoadingReducer";
// import { setLoading } from "../../redux/reducer/LoadingReducer";

export const history = createBrowserHistory();
export const GROUP = "GP00";
export const USER_LOGIN = "USER_LOGIN";

export const DOMAIN = "https://casestudy.cyberlearn.vn/api/";
export const ACCESS_TOKEN = "accessToken";

export const STATUS_CODE = {
  SUCCESS: 200,
  NOT_FOUND: 404,
  ERROR_SERVER: 500,
};

export const settings = {
  setStorageJson: (name: string, data: any): void => {
    data = JSON.stringify(data);
    // console.log(name);
    // console.log(data);
    localStorage.setItem(name, data);
  },
  setStorage: (name: string, data: string): void => {
    localStorage.setItem(name, data);
  },
  getStorageJson: (name: string): any | undefined => {
    if (localStorage.getItem(name)) {
      const dataStore: string | undefined | null = localStorage.getItem(name);
      if (typeof dataStore === "string") {
        const data = JSON.parse(dataStore);
        return data;
      }
      return undefined;
    }
    return; //undefined
  },
  getStore: (name: string): string | null | undefined | boolean | any => {
    if (localStorage.getItem(name)) {
      const data: string | null | undefined = localStorage.getItem(name);
      return data;
    }
    return; //undefined
  },
  setCookieJson: (name: string, value: any, days: number): void => {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    value = JSON.stringify(value);
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  },
  getCookieJson: (name: string): any => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0)
        return JSON.parse(c.substring(nameEQ.length, c.length));
    }
    return null;
  },
  setCookie: (name: string, value: string, days: number): void => {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  },
  getCookie: (name: string): string | null => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  eraseCookie: (name: string): void => {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  },
  clearStorage: (name: string) => {
    localStorage.removeItem(name);
  },
};

export const http = axios.create({
  baseURL: DOMAIN,
  timeout: 30000,
});

//cấu hình cho tất cả request gửi đi

http.interceptors.request.use(
    (config)=>{
        config.headers={// nếu gặp lỗi chổ này thì cài lại phiên bản axios 0.27.2
            ...config.headers,
            Authorization:"Bearer "+ settings.getStore(ACCESS_TOKEN)
        }
        return config
    },
    (err)=>{
        return Promise.reject(err);
    }
)
// cấu hình cho tất cả kết quả trả về ( cấu hình cho response )
http.interceptors.response.use(
  (response) => {
    // console.log(response.data.message)

    // any satus code that lie within the range of 2xx cause this function to trigger
    // do something with response data
    return response;
  },
  (error) => {
    // hàm cấu hình cho tất cả lõi nhận về
    // console.log(error.response?.data);
    if (
      error.response?.data.statusCode === 400 || error.response.data?.statusCode === 404 ||error.response.data.statusCode===500) {
      openNotificationWithIcon("error", error.response?.data.content);
      store.dispatch(setLoading(false))
    }
    if (error.response?.status === 401 ) {
      store.dispatch(setLoading(false))
      // openNotificationWithIcon("error", error.response?.data.content);
    }
    if(error.response?.status === 403)
      openNotificationWithIcon("error", "You do not have permission to perform this operation !");
    // if (error.response) return Promise.reject(error);
  }
);

/** Các status code thường gặp
 * 200: request gửi đi và nhận về kết quả thành công
 * 201: request gửi đi thành công và đã được khởi tạo
 * 400: bad request => request gửi đi thành công tuy nhiên không tìm thấy dữ liệu từ tham số gửi đi
 * 404: not found ( không tìm thấy api đó ), hoặc tương tự như 400
 * 401:  Unauthorize token không hợp lệ không có quyền truy cập vào api đó
 * 403: Forbinden token hợp lệ tuy nhiên chưa đủ quyền để truy cập vào api đó
 * 500 : error server ( lỗi xảy ra trên server có khả năng là frontend gửi dữ liệu chưa hợp lệ  đến backend xử lý bị lỗi). Backend code lỗi trên server ! => test bằng post man hoặc swagger nếu api khooign lỗi => front code sai , ngược lại thì báo cho backend fix
 *
 *
 */
