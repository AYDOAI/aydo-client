import { TemplateRef } from "@angular/core";

export type FrameStep =
  ''
  | 'main'
  | 'sign-in'
  | 'sign-up'
  | 'demo'
  | 'forgot'
  | 'add-hub'
  | 'config-hub'
  | 'devices'
  | 'add-device'
  | 'edit-device'
  | 'profile'
  | 'dashboard';

export type HubType = 'hub_aydo' | 'hub_pi' | 'hub_other';

export type AppFormType = 'input' | 'button' | 'text' | 'string' | 'checkbox' | 'template' | 'agreement' | 'select';

export interface AppForm {
  title: string;
  description?: string;
  footer?: string;
  inputs: AppFormInputs[];
}

export interface AppFormInputs {
  key: string;
  title: string;
  type: AppFormType;
  color?: string | undefined;
  backgroundColor?: string | undefined;
  value?: any;
  inputType?: string;
//   name: string;
  minLength?: number;
  maxLength?: number;
  defaultValue?: any;
  email?: boolean;
  required?: boolean;
  matchingKey?: string;
  onlyLetters?: boolean;
  requiredTrue?: boolean;
  displayError?: boolean;
// //   hidden?: boolean;
// //   hidden2?: boolean;
  number?: boolean;
  group?: boolean;
// //   type?: InputControlType;
// //   title?: string;
// //   text?: string;
// //   button_title?: string;
// //   icon?: string;
   items?: SelectItem[];
   class?: string;
// //   placeholder?: string;
//   readonly?: string;
   multi?: boolean;
// //   rows?: number;
// //   autocomplete?: string;
// //   groupTab?: string;
// //   reloadDevice?: boolean;
// //   params?: any;
// //   command?: string;
// //   visibleField?: string;
// //   description?: string;
  error?: string;
  icon?: string;
  template?: TemplateRef<any>;
}

export interface SelectItem {
  id: string | number;
  title?: string;
  icon?: string;
}
