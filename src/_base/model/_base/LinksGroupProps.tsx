export interface SideNavLink {
  label: string;
  link?: string;
  /** Icon Lucide. Dùng ComponentType để nhận cả forwardRef component. */
  icon?: React.ComponentType<any>;
  /** Menu con lồng cấp — hiển thị thụt vào kèm đường dọc phân cấp. */
  links?: SideNavLink[];
}

/** Phân hệ cấp 1 — có icon và nhãn lớn. */
export interface LinksGroupProps {
  icon?: React.ComponentType<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: SideNavLink[];
}
