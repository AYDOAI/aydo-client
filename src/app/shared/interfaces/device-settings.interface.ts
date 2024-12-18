export interface IDeviceSettings {
  device_ident: string;
  device_name: string;
  settings?: { [key: string]: string };
}
