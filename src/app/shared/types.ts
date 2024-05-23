export type WelcomeStep = 'main' | 'sign-in' | 'sign-up' | 'demo' | 'forgot' | 'add-hub';

export type AppFormType = 'input' | 'button';

export interface AppForm {
  title: string;
  description?: string;
  footer?: string;
  inputs: AppFormInputs[];
}

export interface AppFormInputs {
  title: string;
  type: AppFormType;
  color?: string | undefined;
  backgroundColor?: string | undefined;
}