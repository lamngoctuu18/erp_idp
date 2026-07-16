export interface SelectListItem {
  disabled: boolean;
  group: SelectListGroup | null; // SelectListGroup là một giao diện hoặc lớp khác
  selected: boolean;
  text: string;
  value: string;
}
export interface SelectListItemMantine {
  lable: string;
  value: string;
}
export interface SelectListGroup {
  disabled: boolean;
  name: string;
}
export interface SelectListItemModel {
  label: string;
  value: string;
  money?: string;
}
