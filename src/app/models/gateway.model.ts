import {BaseItem, BaseModel} from './base';
import { AppFormType, SelectItem } from '../shared/types';

export class GatewayItem extends BaseItem {
  identifier: string | undefined;
  token: string | undefined;
}

export class DriversModel extends BaseModel {
  items: DriverItem[] = [];

  constructor(data?: any) {
    super(null);
    this.update(data);
  }

  update(data: any[]) {
    this.items = [];
    if (data) {
      data.forEach((item) => {
        this.items.push(new DriverItem(this, item));
      });
    }
  }

}

export class DriverItem extends BaseItem {
  driverId: number | undefined;
  className: string | undefined;
  parentClassName: string | undefined;
  name: string | undefined;
  settings: SettingsModel | undefined;

  constructor(parent: BaseModel, data: any) {
    super(parent, null)
    if (data) {
      Object.keys(data).forEach(key => {
        if (key === 'settings') {
          // @ts-ignore
          this[key] = new SettingsModel(data[key])
          // console.log(data[key])
        } else {
          // @ts-ignore
          this[key] = data[key];
        }
      });
    }
  }

}

export class SettingsModel extends BaseModel {
  items: SettingItem[] = [];

  constructor(data?: any) {
    super(null);
    this.update(data);
  }

  update(data: any[]) {
    this.items = [];
    if (data) {
      data.forEach((item) => {
        this.items.push(new SettingItem(this, item));
      });
    }
  }

}

export class SettingItem extends BaseItem {
  key!: string;
  name!: string;
  defaultValue!: string;
  description!: string;
  items!: SelectItem[];
  _type!: AppFormType;

  get type(): AppFormType {
    return this._type;
  }

  set type(value: string) {
    if (value === 'text') {
      value = 'input';
    }
    this._type = value as AppFormType;
  }

}

export class DevicesModel extends BaseModel {
  items: DeviceItem[] = [];

  constructor(data?: any) {
    super(null);
    this.update(data);
  }

  update(data: any[]) {
    this.items = [];
    if (data) {
      data.forEach((item) => {
        this.items.push(new DeviceItem(this, item));
      });
    }
  }

}

export class DeviceItem extends BaseItem {

  ident!: string;
  name!: string;
  driverId!: number;
  capabilities!: any[];

}
