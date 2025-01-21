export interface IDeviceSettings {
  device_ident: string;
  device_name: string;
  zone_id: number | null;
  settings?: { [key: string]: string };
}
