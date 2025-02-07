import { BaseItem, BaseModel } from './base';

export class UsersModel extends BaseModel {
  items: UserItem[] = [];

  constructor(data?: any) {
    super(null);
    this.update(data);
  }

  update(data: any[]) {
    this.items = [];
    if (data) {
      data.forEach(item => {
        this.items.push(new UserItem(this, item));
      });
    }
  }
}

export class UserItem extends BaseItem {
  id: string = '';
  firstname: string = '';
  lastname: string = '';
  login: string = '';
  password: string = '';
}

export class LoginItem extends BaseItem {
  login: string = '';
  password: string = '';
}

export interface UserInfo {
  id: number;
  firstname: string;
  lastname: string;
  login: string;
  email: string;
  params?: any;
  balance?: string;
  token: string;
  refresh_token: string;
  is_verified?: boolean;
  wallet: string;
  is_blocked?: boolean;
  avatar?: {
    fileId: string;
    url: string;
  };
  deletedAt?: Date;
  invite_code: string;
}

export interface UserRewards {
  id: number;
  title: string;
  value: number;
  currency: string;
}
