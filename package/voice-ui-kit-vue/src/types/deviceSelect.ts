export type DeviceSelectClassNames = {
  selectTrigger?: string;
  selectContent?: string;
  selectItem?: string;
};

export type DeviceSelectProps = {
  placeholder?: string;
  guide?: string;
  className?: string;
  classNames?: DeviceSelectClassNames;
  noDevicesText?: string;
};
