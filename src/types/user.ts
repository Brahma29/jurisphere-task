export const USER_STATUSES = ["active", "inactive"];

export type TUserStatus = (typeof USER_STATUSES)[number];

export type TUser = {
  id: number;
  name: string;
  email: string;
  status: TUserStatus;
  address: string;
  joined_at: Date;
  notes: string;
};
