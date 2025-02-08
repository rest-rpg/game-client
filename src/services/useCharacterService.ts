import { useState } from "react";
import useErrorToast from "../hooks/useErrorToast";
import { useStores } from "../store/RootStore";
import useSuccessToast from "../hooks/useSuccessToast";
import { Error } from "../classes/error/Error";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import {
  CharacterBasics,
  CharacterCreateRequest,
  CharacterApiFp,
} from "../generated-sources/openapi/game";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { BASE_URL } from "../api/axios";
import useServiceHelper from "./helpers/useServiceHelper";

export const THUMBNAIL_URL = BASE_URL + "/game/avatars/thumbnail";

const useCharacterService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const errorToast = useErrorToast();
  const successToast = useSuccessToast();
  const { characterStore } = useStores();
  const { t } = useTranslation();
  const axiosPrivate = useAxiosPrivate();
  const { getResources } = useServiceHelper();
  const api = CharacterApiFp();

  const create = async (request: CharacterCreateRequest) => {
    setIsLoading(true);
    const createCharacter = await api.createCharacter(request, {
      withCredentials: true,
    });

    createCharacter(axiosPrivate)
      .then((response) => {
        characterStore.characterLite(response.data);
        successToast(t("CHARACTER.CREATION_SUCCESSFUL"));
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

  const getUserCharacters = async (): Promise<CharacterBasics | undefined> => {
    setIsLoading(true);
    const getCharacters = await api.getUserCharacters({
      withCredentials: true,
    });

    return getResources(getCharacters, setIsLoading);
  };

  const getUserCharacter = async (characterId: number) => {
    setIsLoading(true);
    const getCharacter = await api.getUserCharacter(characterId, {
      withCredentials: true,
    });

    const character = getResources(getCharacter, setIsLoading);
    character
      .then((c) => {
        if (c) {
          characterStore.characterDetails(c);
        }
      })
      .catch((e) => console.log(e));
  };

  return {
    isLoading,
    create,
    getUserCharacters,
    getUserCharacter,
  };
};

export default useCharacterService;
