import React, { useEffect, useState } from "react";

import {
  Link,
  NavLink,
  Outlet,
  redirect,
  useLocation,
  useNavigate,
  useNavigation,
  useResolvedPath,
} from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Group,
  Burger,
  Skeleton,
  ScrollArea,
  Text,
  Anchor,
  Input,
} from "@mantine/core";
import _breadcrumb from "./_breadcrumb";
import { AuthProvider } from "../../helper/IAuthProvider";
import { SkeletonBase } from "./_skeleton";
import { LogOut, Search } from "lucide-react";
import classes from "../../_style/NavbarSegmented.module.css";
import { _sideNavData } from "../../../_setup/navdata/_sideNavData";
import { LinksGroup } from "./NavbarLinksGroup";
import { isNullOrEmpty } from "../../extension/StringExtension";
import { searchSideNavData } from "../../helper/FunctionHelper";
import { LinksGroupProps } from "../../model/_base/LinksGroupProps";
import TokenService from "../../../api/login/token.service";
import { NotificationExtension } from "../../extension/NotificationExtension";
import idpLogo from "../../../assets/images/logo-idp.png";
import { repositoryAuth } from "../../_const/_constVar";
//context

export const Layout1 = () => {
  // #region state

  const location = useLocation();
  const navigate = useNavigate();
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [sideNavs, setSideNavs] = useState<LinksGroupProps[]>([]);

  //#endregion

  //#region  auth
  const listRouterIgnore = [""];
  const isAuthenticated = AuthProvider.isAuthenticated();

  //#endregion
  useEffect(() => {
    setLoadingSkeleton(false);
    window.scrollTo(0, 0);
    // if (
    //   !listRouterIgnore.includes(location.pathname) &&
    //   isAuthenticated === false
    // ) {
    //   navigate("/auth/login?callback=" + location.pathname);
    // } else console.log(" check auth " + location.pathname);
    setSideNavs(_sideNavData);

    return () => {
      setLoadingSkeleton(true);
    };
  }, [location.pathname]);

  //

  // matine

  // search menu
  function searchDataSide(q: string) {
    if (isNullOrEmpty(q)) return setSideNavs(_sideNavData);
    return setSideNavs(searchSideNavData(sideNavs, q));
  }
  const searchModel = (
    <Input
      placeholder="Tìm kiếm"
      leftSection={<Search size={16} strokeWidth={1.75} color="#94a3b8" />}
      classNames={{ input: classes.searchInput }}
      onChange={(e: any) => searchDataSide(e.target.value)}
    />
  );
  const links = sideNavs.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  const handleLogout = () => {
    repositoryAuth
      .post("/api/v1/auth/logout", {}, true, {
        silent: true,
        timeoutMs: 3000,
      })
      .catch((error) => {
        console.warn("Logout API skipped or failed:", error);
    });

    TokenService.removeUser();
    NotificationExtension.Success("Bạn đã đăng xuất thành công");
    navigate("/auth/login", { replace: true });
  };
  return (
    <>
      <AppShell
        header={{ height: 75 }}
        navbar={{
          width: 272,
          breakpoint: 0,
          collapsed: { desktop: !desktopOpened },
        }}
        padding="md"
      >
        <AppShell.Header className={classes.headerInner}>
          <Group h="100%" px="md" justify="space-between" align="center">
            <Group gap="md">
              <Burger
                opened={desktopOpened}
                onClick={toggleDesktop}
                visibleFrom="md"
                size="sm"
              />
              <Burger
                opened={mobileOpened}
                onClick={toggleMobile}
                hiddenFrom="md"
                size="sm"
              />
              <img
                src={idpLogo}
                alt="logo"
                className={classes.headerLogoImg}
              />
            </Group>
            
            <Group>
              <a className={classes.headerLogoutLink} onClick={handleLogout}>
                <LogOut size={16} strokeWidth={1.8} />
                <span>Đăng xuất</span>
              </a>
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar className={classes.navbar}>
          <AppShell.Section className={classes.searchSection}>{searchModel}</AppShell.Section>
          <AppShell.Section grow component={ScrollArea} className={classes.links} type="hover" scrollbars="y">
            <div className={classes.linksInner}>{links}</div>
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main>
          {loadingSkeleton ? (
            <SkeletonBase visible={loadingSkeleton}></SkeletonBase>
          ) : (
            <>
              {/* <_breadcrumb></_breadcrumb> */}
              <Outlet />
            </>
          )}
        </AppShell.Main>
      </AppShell>
    </>
  );
};
