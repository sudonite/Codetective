import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API } from "@/Consts";
import { StatusType } from "@/Types";

const JWT_TOKEN_KEY = "jwtToken";

const createAxiosInstance = (jwtToken: string | null) => {
  const instance = axios.create({
    baseURL: API,
    timeout: 5000,
  });

  instance.interceptors.request.use(async config => {
    if (config?.data instanceof FormData) {
      Object.assign(config?.headers, { "Content-Type": "multipart/form-data" });
    }
    if (jwtToken) {
      const decodedToken = jwtDecode(jwtToken);
      if (decodedToken && decodedToken?.exp) {
        const expired = decodedToken.exp < new Date().getTime() / 1000;
        if (expired) {
          localStorage.removeItem(JWT_TOKEN_KEY);
          delete instance.defaults.headers.common["Authorization"];
          window.location.href = "/auth/login";
        } else {
          config.headers.Authorization = `Bearer ${jwtToken}`;
        }
      }
    }
    return config;
  });

  instance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error?.response?.status === 401) {
        localStorage.removeItem(JWT_TOKEN_KEY);
        delete instance.defaults.headers.common["Authorization"];
        window.location.href = "/auth/login";
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

let instance = createAxiosInstance(localStorage.getItem("jwtToken"));

export const LoginAPI = async (data: any) => {
  try {
    const response = await instance.post("/auth/login", data);
    localStorage.setItem(JWT_TOKEN_KEY, response?.data?.token);
    instance = createAxiosInstance(response?.data?.token);
    return { status: response.status };
  } catch (error: any) {
    return { status: error?.response?.status };
  }
};

export const LogoutAPI = async () => {
  localStorage.removeItem(JWT_TOKEN_KEY);
  instance = createAxiosInstance(null);
};

export const RegisterAPI = async (data: any) => {
  try {
    const response = await instance.post("/auth/register", data);
    return { status: response.status };
  } catch (error: any) {
    return { status: error?.response?.status };
  }
};

export const EditProfileAPI = async (data: any) => {
  try {
    const response = await instance.put("/user", data);
    return { status: response.status };
  } catch (error: any) {
    return { status: error?.response?.status };
  }
};

export const DeleteProfileAPI = async () => {
  try {
    const response = await instance.delete("/user");
    return { status: response.status };
  } catch (error: any) {
    return { status: error?.response?.status };
  }
};

export const GetProfileAPI = async () => {
  try {
    const response = await instance.get("/user");
    return { data: response?.data, status: response.status };
  } catch (error: any) {
    return { status: error?.response?.status };
  }
};

export const GetRepositoriesAPI = async () => {
  try {
    const response = await instance.get("/repositories");
    return { data: response?.data, status: response.status };
  } catch (error: any) {
    return { status: error?.response?.status };
  }
};

export const DeleteRepositoryAPI = async (repositoryId: string) => {
  try {
    const response = await instance.delete(`/repository/${repositoryId}`);
    return { status: response.status };
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

export const GenerateGitKeyAPI = async (keyID: string) => {
  try {
    const response = await instance.put(`/key/git/${keyID}`);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    return { status: error?.response?.status };
  }
};

export const DeleteGitKeyAPI = async (keyID: string) => {
  try {
    const response = await instance.delete(`/key/git/${keyID}`);
    return { status: response.status };
  } catch (error: any) {
    return { status: error?.response?.status };
  }
};
