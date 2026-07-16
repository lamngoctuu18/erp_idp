import { useEffect, useState } from "react";
import { Collapse, UnstyledButton } from "@mantine/core";
import { ChevronDown, ChevronRight } from "lucide-react";
import classes from "../../_style/NavbarLinksGroup.module.css";
import { LinksGroupProps, SideNavLink } from "../../model/_base/LinksGroupProps";
import { useLocation, useNavigate } from "react-router-dom";

const formatLink = (link: string) => (link.startsWith("/") ? link : `/${link}`);

const useIsLinkActive = () => {
  const pathname = useLocation().pathname;
  return (link?: string) => {
    if (!link) return false;
    const formatted = formatLink(link);
    return formatted === "/" ? pathname === "/" : pathname.startsWith(formatted);
  };
};

/** Mục menu (cấp 2 trở xuống). Tự render các cấp con lồng bên trong. */
function NavItem({ item }: { item: SideNavLink }) {
  const navigate = useNavigate();
  const isLinkActive = useIsLinkActive();

  const hasChildren = !!item.links?.length;
  const isSelfActive = isLinkActive(item.link);

  // Mục con (ở bất kỳ cấp nào) đang được xem?
  const hasActiveDescendant = (node: SideNavLink): boolean =>
    (node.links ?? []).some(
      (child) => isLinkActive(child.link) || hasActiveDescendant(child)
    );
  const descendantActive = hasActiveDescendant(item);

  const [opened, setOpened] = useState(descendantActive);

  // Tự mở khi điều hướng tới một mục con bên trong
  useEffect(() => {
    if (descendantActive) setOpened(true);
  }, [descendantActive]);

  const Icon = item.icon;

  return (
    <div>
      <a
        className={classes.link}
        href={item.link ? formatLink(item.link) : undefined}
        title={item.label} /* hiện đủ nhãn khi bị cắt bởi bề rộng sidebar */
        data-active={isSelfActive || undefined}
        data-parent-active={(!isSelfActive && descendantActive) || undefined}
        onClick={(event) => {
          event.preventDefault();
          // Có link thì điều hướng; không có link thì bấm cả dòng để mở/đóng
          if (item.link) navigate(formatLink(item.link));
          else if (hasChildren) setOpened((o) => !o);
        }}
      >
        {Icon && <Icon size={18} strokeWidth={1.75} className={classes.linkIcon} />}
        <span className={classes.linkLabel}>{item.label}</span>

        {hasChildren && (
          <span
            role="button"
            aria-label={opened ? "Thu gọn" : "Mở rộng"}
            className={`${classes.linkChevron} ${
              opened ? classes.linkChevronOpened : ""
            }`}
            onClick={(event) => {
              // Chevron chỉ đóng/mở, không kéo theo điều hướng
              event.preventDefault();
              event.stopPropagation();
              setOpened((o) => !o);
            }}
          >
            <ChevronRight size={15} strokeWidth={2} />
          </span>
        )}
      </a>

      {hasChildren && (
        <Collapse in={opened}>
          <div className={classes.subLinksNested}>
            {item.links!.map((child) => (
              <NavItem key={child.label} item={child} />
            ))}
          </div>
        </Collapse>
      )}
    </div>
  );
}

/** Phân hệ (cấp 1) — tiêu đề riêng cao 64px + danh sách mục menu bên dưới. */
export function LinksGroup({ icon: Icon, label, initiallyOpened, links }: LinksGroupProps) {
  const isLinkActive = useIsLinkActive();
  const hasLinks = Array.isArray(links) && links.length > 0;

  const isNavLinkActive = (item: SideNavLink): boolean =>
    isLinkActive(item.link) || (item.links ?? []).some(isNavLinkActive);

  const isAnyChildActive = hasLinks && links!.some(isNavLinkActive);

  const [opened, setOpened] = useState(initiallyOpened || isAnyChildActive);

  useEffect(() => {
    if (isAnyChildActive) setOpened(true);
  }, [isAnyChildActive]);

  return (
    <div className={classes.group}>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
        data-active={isAnyChildActive || undefined}
        data-parent-active={isAnyChildActive || undefined}
      >
        <span className={classes.controlInner}>
          {Icon && (
            <div className={classes.controlIconWrapper}>
              <Icon className={classes.controlIcon} size={18} stroke={1.5} />
            </div>
          )}
          <span className={classes.controlLabel}>{label}</span>
        </span>
        {hasLinks && (
          <ChevronDown
            size={16}
            strokeWidth={2}
            className={`${classes.chevron} ${
              opened ? classes.chevronOpened : ""
            }`}
          />
        )}
      </UnstyledButton>

      {hasLinks && (
        <Collapse in={opened}>
          <div className={classes.subLinks}>
            {links!.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </div>
        </Collapse>
      )}
    </div>
  );
}
