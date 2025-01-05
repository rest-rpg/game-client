import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshTokenService from "../../services/useRefreshTokenService";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useStores } from "../../store/RootStore";
import { observer } from "mobx-react";

const PersistLogin = observer(() => {
  const [isLoading, setIsLoading] = useState(true);
  const refreshTokenService = useRefreshTokenService();
  const { authStore } = useStores();
  const [persist] = useLocalStorage("persist", false);

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refreshTokenService.refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };
    
    !authStore.accessToken && persist
      ? verifyRefreshToken()
          .then(() => {
            console.log("Token refreshed");
          })
          .catch((err) => {
            console.log(err);
          })
      : setIsLoading(false);

    return () => {
      isMounted = false;
    };
  }, [authStore.accessToken, persist, refreshTokenService.refresh]);

  return (
    <>{!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}</>
  );
});

export default PersistLogin;
