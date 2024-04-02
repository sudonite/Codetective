import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API } from "@/Consts";
import { StatusType } from "@/Types";

function createAxiosInstance(jwtToken: string | null) {
  const instance = axios.create({
    baseURL: API,
  });

  instance.interceptors.request.use(async function (config) {
    if (config?.data instanceof FormData) {
      Object.assign(config?.headers, { "Content-Type": "multipart/form-data" });
    }
    if (jwtToken) {
      const decodedToken = jwtDecode(jwtToken);
      if (decodedToken && decodedToken?.exp) {
        const expired = decodedToken.exp < new Date().getTime() / 1000;
        if (expired) {
          localStorage.removeItem("jwtToken");
          delete instance.defaults.headers.common["Authorization"];
        } else {
          console.log(decodedToken);
          config.headers.Authorization = `Bearer ${jwtToken}`;
        }
      }
    }
    return config;
  });

  return instance;
}

let instance = createAxiosInstance(localStorage.getItem("jwtToken"));

export const LoginAPI = async (data: any) => {
  try {
    const response = await instance.post("/auth/login", data);
    localStorage.setItem("jwtToken", response?.data?.token);
    instance = createAxiosInstance(response?.data?.token);
    console.log(instance);
    return { status: response.status };
  } catch (error: any) {
    return { status: error?.response?.status };
  }
};

export const RegisterAPI = async (data: any) => {
  try {
    const response = await instance.post("/auth/register", data);
    return { status: response.status };
  } catch (error: any) {
    return { status: error?.response?.status };
  }
};

export const GetRepositoriesAPI = async () => {
  try {
    const response = await instance.get("/repositories");
    console.log(response);
    return { data: response?.data, status: response.status };
  } catch (error: any) {
    return { status: error?.response?.status };
  }
};

export const GetFilesAPI = async (repositoryId: string) => {
  try {
    const response = await instance.get(`/files/${repositoryId}`);
    return { data: response?.data, status: response.status };
  } catch (error: any) {
    return { status: error?.response?.status };
  }
};

export const GetCodesAPI = async (fileId: string) => {
  try {
    const response = await instance.get(`/codes/${fileId}`);
    return { data: response?.data, status: response.status };
  } catch (error: any) {
    return { status: error?.response?.status };
  }
};

export const ChangeCodeStatusAPI = async (
  codeId: string,
  status: StatusType
) => {
  try {
    const response = await instance.put(`/code/${codeId}`, { status });
    return { status: response.status };
  } catch (error: any) {
    return { status: error?.response?.status };
  }
};
