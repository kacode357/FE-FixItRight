interface User {
  Id: string;
  Avatar: string;
  Fullname: string | null;
  UserName: string;
  PhoneNumber: string | null;
  Address: string | null;
  Gender: string;
  Birthday: string;
  Roles: string[];
  IsVerified: boolean;
  Active: boolean;
}
