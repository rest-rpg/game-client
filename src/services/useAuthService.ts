import { useState } from "react";
import useErrorToast from "../hooks/useErrorToast";
import { useStores } from "../store/RootStore";
import useSuccessToast from "../hooks/useSuccessToast";
import { Error } from "../classes/error/Error";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import {
  AuthenticationApiFp,
  AuthenticationRequest,
} from "../generated-sources/openapi/auth";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const useAuthService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const errorToast = useErrorToast();
  const successToast = useSuccessToast();
  const { authStore } = useStores();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const api = AuthenticationApiFp();

  const authenticate = async (request: AuthenticationRequest) => {
    setIsLoading(true);
    const authenticate = await api.authenticate(request, {
      withCredentials: true,
    });

    authenticate(axios)
      .then((response) => {
        authStore.auth(response.data);
        successToast(t("AUTH.LOGIN_SUCCESSFUL"));
        navigate("/home");
      })
      .catch((err: AxiosError) => {
        if (err.response?.data) {
          const error = err as Error;
          errorToast(t(`ERROR.${error.response.data.message}`));
        } else {
          errorToast(t("ERROR.COMMUNICATION"));
        }
      })
      .finally(() => setIsLoading(false));
  };

  return {
    isLoading,
    authenticate,
  };
};

export default useAuthService;
