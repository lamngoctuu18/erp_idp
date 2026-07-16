import React, { useEffect, useRef, useState } from "react";
import { IconLogout } from "@tabler/icons-react";
import classes from "../../_style/NavbarSegmented.module.css";
import { _sideNavData } from "../../../_setup/navdata/_sideNavData";
import { LinksGroupProps } from "../../model/_base/LinksGroupProps";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import {
  ToolbarComponent,
  ItemsDirective,
  ItemDirective,
} from "@syncfusion/ej2-react-navigations";
import { Text } from "@mantine/core";
import { LinksGroup } from "./NavbarLinksGroup";
//context

export const Layout = () => {
  // #region state

  const location = useLocation();
  const [sideNavs, setSideNavs] = useState<LinksGroupProps[]>([]);

  //#endregion

  //#region  auth
  //#endregion
  useEffect(() => {
    //   nprogress.start()
    window.scrollTo(0, 0);

    setSideNavs(_sideNavData);

    return () => {};
  }, [location.pathname]);

  //

  let sidebarobj = useRef<SidebarComponent>(null);

  const width: string = "290px";
  const target: string = ".main-sidebar-content";
  const mediaQuery: string = "(min-width: 600px)";
  let folderEle: string =
    '<div class= "e-folder"><div class= "e-folder-name"><img alt=""src="https://hanoicomputercdn.com/media/lib/09-08-2023/logo-hacom-since-2001.png" /></div></div>';
  //toggle the sidebar
  const toolbarCliked = (): void => {
    sidebarobj?.current?.toggle();
  };

  const links = sideNavs.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <>
      <div className="control-section" id="responsive-wrapper">
        <div id="reswrapper">
          {/* header-section  declaration */}
          <div>
            <ToolbarComponent
              id="resToolbar"
              clicked={toolbarCliked.bind(this)}
            >
              <ItemsDirective>
                <ItemDirective template={folderEle}></ItemDirective>
                <ItemDirective
                  prefixIcon="e-icons e-menu"
                  tooltipText="Menu"
                ></ItemDirective>
              </ItemsDirective>
            </ToolbarComponent>
          </div>
          {/* end of header-section */}
          <SidebarComponent
            id="sideTree"
            className="sidebar-treeview"
            ref={sidebarobj}
            width={width}
            target={target}
            mediaQuery={mediaQuery}
            isOpen={true}
          >
            <div className="res-main-menu">
              <div className="table-content">
                {/* <TextBoxComponent
                  id="resSearch"
                  placeholder="Search..."
                ></TextBoxComponent> */}
                <Text
                  size="md"
                  fw={900}
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan", deg: 90 }}
                >
                  Menu
                </Text>
              </div>
              <div>
                {/* <ScrollArea className={classes.links}> */}
                <div className={classes.linksInner}>{links}</div>
                {/* </ScrollArea> */}
                {/* 
                <TreeViewComponent
                  id="mainTree"
                  ref={(t) => {
                    if (t !== null) treeObj = t;
                  }}
                  cssClass="main-treeview"
                  fields={fields}
                  expandOn="Click"
                  nodeClicked={toolbarCliked1}
                /> */}
              </div>
            </div>

            <div className="footer-fixed">
              {/* <a
                href="#"
                className={classes.link}
                onClick={(event) => event.preventDefault()}
              >
                <IconSwitchHorizontal
                  className={classes.linkIcon}
                  stroke={1.5}
                />
                <span>Change account</span>
              </a> */}

              <a className={classes.link}>
                <IconLogout className={classes.linkIcon} stroke={1.5} />
                <span>Đăng xuất</span>
              </a>
            </div>
          </SidebarComponent>
          {/* end of sidebar element */}
          {/* .main-sidebar-content declaration */}
          <div className="main-sidebar-content" id="main-text">
            <div className="sidebar-content">
              {/* <div
                className="sidebar-heading"
                style={{
                  borderBottom: "1px solid #eaeaeae0",
                  paddingBottom: "12px",
                }}
              >
                <BreadCrumb></BreadCrumb>
              </div> */}
              <div className="paragraph-content">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
