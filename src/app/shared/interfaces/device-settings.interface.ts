export interface IDeviceSettings {
  device_ident: string;
  device_name: string;
  zone_id: number;
  settings?: { [key: string]: string };
}
