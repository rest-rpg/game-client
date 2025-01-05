import { useState } from "react";
import useErrorToast from "../hooks/useErrorToast";
import useSuccessToast from "../hooks/useSuccessToast";
import { Error } from "../classes/error/Error";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { RegisterRequest, UserApiFp } from "../generated-sources/openapi/user";

const useUserService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const errorToast = useErrorToast();
  const successToast = useSuccessToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const api = UserApiFp();

  const register = async (request: RegisterRequest) => {
    setIsLoading(true);
    const register = await api.register(request);

    register(axiosPrivate)
      .then(() => {
        successToast(t("AUTH.REGISTRATION_SUCCESSFUL"));
        navigate("/login");
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
    register,
  };
};

export default useUserService;
