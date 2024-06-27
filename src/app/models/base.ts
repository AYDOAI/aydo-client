export class BaseModel {

  constructor(data?: any) {
    if (data) {
      Object.keys(data).forEach(key => {
        // @ts-ignore
        this[key] = data[key];
      });
    }
  }

}

export class BaseItem {
  parent?: BaseModel;

  constructor(parent: BaseModel, data: any) {
    this.parent = parent;
    if (data) {
      Object.keys(data).forEach(key => {
        // @ts-ignore
        this[key] = data[key];
      });
    }
  }

}
