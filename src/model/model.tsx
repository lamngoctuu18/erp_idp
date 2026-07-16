import { SetStateAction } from "react";

// SelectListItem.tsx

export type TodoContextType = {
  isCreate: boolean;
  setIsCreate: SetStateAction<boolean>;
};
