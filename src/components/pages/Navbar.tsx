/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useStores } from "../../store/RootStore";
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { MdLanguage } from "react-icons/md";
import useLogout from "../../hooks/useLogout";
import CharactersPopover from "../character/CharactersPopover";

interface Language {
  nativeName: string;
}

interface Languages {
  [key: string]: Language;
}

const lngs: Languages = {
  en: { nativeName: "English" },
  pl: { nativeName: "Polski" },
};

const Navbar = observer(() => {
  const [logged, setLogged] = useState("");
  const { authStore } = useStores();
  const { t, i18n } = useTranslation();
  const logout = useLogout();

  useEffect(() => {
    setLogged(authStore.role?.toUpperCase());
  }, [authStore.role]);

  return (
    <Box bg="gray.900" color="gray.100" py={4} px={8} width="100vw">
      <Flex alignItems="center" justifyContent="space-between">
        <Link as={RouterLink} to="/" fontSize="xl" fontWeight="bold">
          {t("NAVBAR.TITLE")}
        </Link>
        <Flex alignItems="center">
          {logged === "ADMIN" && (
            <Link as={RouterLink} to="/admin/home" mx={2}>
              {t("NAVBAR.HOME")}
            </Link>
          )}
          {logged === "USER" && (
            <>
              <CharactersPopover />
              <Link as={RouterLink} to="/user/home" mx={2}>
                {t("NAVBAR.HOME")}
              </Link>
              <Link as={RouterLink} to="/user/character/create" mx={2}>
                {t("CHARACTER.CREATE")}
              </Link>
            </>
          )}
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              bg="gray.900"
              color="gray.100"
              _hover={{ bg: "gray.800", color: "gray.100" }}
            >
              <MdLanguage />
            </MenuButton>
            <MenuList bg="gray.900" color="gray.100">
              {Object.keys(lngs).map((lng) => (
                <MenuItem
                  bg="gray.900"
                  color="gray.100"
                  key={lng}
                  style={{
                    fontWeight:
                      i18n.resolvedLanguage === lng ? "bold" : "normal",
                  }}
                  type="submit"
                  onClick={() => i18n.changeLanguage(lng)}
                >
                  {lngs[lng].nativeName}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Text me={3}>{authStore.username}</Text>
          {!logged && (
            <>
              <Link as={RouterLink} to="/register" mx={2}>
                {t("AUTH.REGISTER")}
              </Link>
              <Link as={RouterLink} to="/login" mx={2}>
                {t("AUTH.LOGIN")}
              </Link>
            </>
          )}
          {logged && (
            <Button variant="link" onClick={() => logout()}>
              {t("AUTH.LOGOUT")}
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
});

export default Navbar;
