export interface SelectListItemBase extends SelectListItem {
  att1: string;
  att2: string;
  att3: number;
  att4: number;
  att5: any;
}

export interface SelectListItem {
  disabled?: boolean;
  group?: SelectListGroup;
  selected?: boolean;
  text: string;
  value: string;
}

export interface SelectListGroup {
  disabled: boolean;
  name: string;
}
