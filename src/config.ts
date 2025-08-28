import type { InjectionKey } from 'vue';

export type DeviceBreakpoints = {
  mobileMax: number;
  tabletMin: number;
  tabletMax: number;
  laptopMin: number;
};

export type FrontendComponentsConfig = {
  deviceBreakpoints?: Partial<DeviceBreakpoints>;
};

export const defaultBreakpoints: DeviceBreakpoints = {
  // Based on previous logic: mobile < 744; tablet 1035..1278; laptop >= 1279
  mobileMax: 743,
  tabletMin: 1035,
  tabletMax: 1278,
  laptopMin: 1279,
};

export const CONFIG_KEY: InjectionKey<FrontendComponentsConfig> = Symbol('FrontendComponentsConfig');
