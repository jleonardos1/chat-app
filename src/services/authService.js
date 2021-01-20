import API from "./api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notify = (msg) => toast.error(msg, { hideProgressBar: true });

const AuthService = {
  login: (data) => {
    return API.post("/login", data)
      .then(({ data }) => {
        setHeaderAndStorage(data);
        return data;
      })
      .catch((err) => {
        notify(JSON.stringify(data));
        console.log("Auth service err", err);
        throw err;
      });
  },

  register: (data) => {
    return API.post("/register", data)
      .then(({ data }) => {
        setHeaderAndStorage(data);
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  logout: () => {
    API.defaults.headers["Authorization"] = "";
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },

  updateProfile: (data) => {
    const headers = {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    };

    return API.post("/users/update", data, headers)
      .then(({ data }) => {
        localStorage.setItem("user", JSON.stringify(data));
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },
};

const setHeaderAndStorage = ({ user, token }) => {
  API.defaults.headers["Authorization"] = `Bearer ${token}`;
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};

export default AuthService;
