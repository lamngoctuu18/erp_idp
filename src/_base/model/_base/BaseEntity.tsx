export interface BaseEntity {
  createby: string;
  lastupdateby: string;
  createdate: string;
  id: number;
  lastupdatedate: string | null;
  ondelete: boolean | null;
}
