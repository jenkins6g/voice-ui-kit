export type DeviceSelectClassNames = {
  selectTrigger?: string;
  selectContent?: string;
  selectItem?: string;
};

export type DeviceSelectBaseProps = {
  placeholder?: string;
  guide?: string;
  className?: string;
  classNames?: DeviceSelectClassNames;
  selectProps?: {
    disabled?: boolean;
    required?: boolean;
    name?: string;
  };
  contentProps?: {
    className?: string;
  };
};

export type DeviceSelectComponentProps = DeviceSelectBaseProps & {
  availableDevices?: MediaDeviceInfo[];
  selectedDevice?: MediaDeviceInfo | Record<string, never>;
  updateDevice?: (deviceId: string) => void;
};

export type DeviceSelectProps = DeviceSelectBaseProps;
