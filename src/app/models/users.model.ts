import {BaseItem, BaseModel} from './base';

export class UsersModel extends BaseModel {
  items: UserItem[] = [];

  constructor(data?: any) {
    super(null);
    this.update(data);
  }

  update(data: any[]) {
    this.items = [];
    if (data) {
      data.forEach((item) => {
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
