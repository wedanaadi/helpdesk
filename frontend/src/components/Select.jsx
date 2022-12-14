import React from "react";
import SelectComponent from "react-select";

export default function Select({ options, placeHolder, getter, setter, classCustom="", disabled=false }) {
  return (
    <SelectComponent
      options={options}
      placeholder={placeHolder}
      value={getter}
      onChange={setter}
      className={classCustom}
      isDisabled={disabled}
    />
  );
}
