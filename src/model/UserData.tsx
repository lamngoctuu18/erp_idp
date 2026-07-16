export interface UserData {
  jwt: string;
  user: {
    userName: string;
    password: string;
    inActive: boolean;
    role: string;
    roleNumber: number;
    read: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    warehouseId: string;
    listWarehouseId: string;
    onDelete: boolean;
    id: string;
  };
}
