export interface NavItem {
  label: string;
  icon?: string;
  link?: string;
  links?: NavItem[]; // Dùng đệ quy cho thằng cha có items
  initiallyOpened?: boolean;
  
}
