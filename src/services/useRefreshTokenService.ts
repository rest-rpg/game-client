import { AxiosError } from "axios";
import axios from "../api/axios";
import { useStores } from "../store/RootStore";
import { RefreshTokenApiFp } from "../generated-sources/openapi/auth";
import useErrorToast from "../hooks/useErrorToast";
import { Error } from "../classes/error/Error";
import { useTranslation } from "react-i18next";
import useSuccessToast from "../hooks/useSuccessToast";
import { useNavigate } from "react-router-dom";

const useRefreshTokenService = () => {
  const errorToast = useErrorToast();
  const successToast = useSuccessToast();
  const { t } = useTranslation();
  const { authStore } = useStores();
  const api = RefreshTokenApiFp();
  const navigate = useNavigate();

  const refresh = async () => {
    const authenticate = await api.refreshToken("test", {
      withCredentials: true,
    });

    authenticate(axios)
      .then((response) => {
        authStore.auth(response.data);
        return response.data.token;
      })
      .catch((err: AxiosError) => {
        if (err.response?.data) {
          const error = err as Error;
          errorToast(t(`ERROR.${error.response.data.message}`));
        } else {
          errorToast(t("ERROR.COMMUNICATION"));
        }
      });
  };

  const logout = async () => {
    const authenticate = await api.logoutUser("test", {
      withCredentials: true,
    });

    authenticate(axios)
      .then(() => {
        authStore.auth({
          username: "",
          token: "",
          role: "",
        });
        successToast(t("AUTH.LOGOUT_SUCCESSFUL"));
        navigate("/login");
      })
      .catch((err: AxiosError) => {
        if (err.response?.data) {
          const error = err as Error;
          errorToast(t(`ERROR.${error.response.data.message}`));
        } else {
          errorToast(t("ERROR.COMMUNICATION"));
        }
      });
  };

  return { refresh, logout };
};

export default useRefreshTokenService;
