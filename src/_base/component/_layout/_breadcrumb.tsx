import React, { createContext, useContext, useEffect, useState } from "react";

import {
  Link,
  NavigateFunction,
  useLocation,
  useMatches,
  useNavigate,
} from "react-router-dom";
import { isNullOrEmpty } from "../../extension/StringExtension";
import { SelectListItem } from "../../../model/SelectListItem";
import { IBreadCrumbs } from "../../model/_share/breadCrumbs";
import {
  BreadcrumbComponent,
  BreadcrumbItemDirective,
  BreadcrumbItemsDirective,
} from "@syncfusion/ej2-react-navigations";

const BreadCrumb = () => {
  const navigate = useNavigate();
  //
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<IBreadCrumbs[]>();
  let matches = useMatches();
  //
  useEffect(() => {
    console.log(location.pathname);

    const data = Breadcrumbs(matches);
    setBreadcrumbs(data);
  }, [location.pathname]);

  function Breadcrumbs(matches: any) {
    const breadcrumbsData: IBreadCrumbs[] = [];
    breadcrumbsData.push({
      text: "Trang chủ",
      iconCss: "e-icons e-home",
      link: "/dashboard",
      onClick: () => {
        navigate(url);
      },
    });
    let crumbs = matches
      .filter((match: any) => Boolean(match.handle?.crumb))
      .map((match: any) => match.handle.crumb(match.data));
    let url = "";
    for (let index = 0; index < crumbs.length; index++) {
      const element: SelectListItem = crumbs[index];
      if (element && !isNullOrEmpty(element.text) && element.value !== "/") {
        url = url + element.value;
        if (index !== crumbs.length - 1) {
          if (!element.disabled)
            breadcrumbsData.push({
              text: element.text,
              onClick: () => {
                navigate(url);
              },
            });
          else
            breadcrumbsData.push({
              text: element.text,
              onClick: () => {
                navigate(url);
              },
            });
        } else
          breadcrumbsData.push({
            text: element.text,
            onClick: () => {
              navigate(url);
            },
          });
      }
    }
    return breadcrumbsData;
  }

  const _render = () => {
    if (
      breadcrumbs !== undefined &&
      breadcrumbs !== null &&
      breadcrumbs.length > 0
    ) {
      return (
        <>
          <BreadcrumbComponent enableNavigation={true}>
            <BreadcrumbItemsDirective>
              {breadcrumbs.map((breadcrumb, index) => (
                <BreadcrumbItemDirective
                  key={index}
                  iconCss={breadcrumb.iconCss}
                  text={breadcrumb.text}
                  //  disabled={true}
                  // url={breadcrumb.url}
                />
              ))}
            </BreadcrumbItemsDirective>
          </BreadcrumbComponent>
        </>
      );
    }
  };

  return <>{_render()}</>;
};

export default BreadCrumb;
