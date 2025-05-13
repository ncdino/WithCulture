import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

export default function Selector({
  onValueChange,
  placeholder,
  data,
  containerStyle,
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(data);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={(val) => {
        setValue(val);
        onValueChange(val);
      }}
      setItems={setItems}
      placeholder={placeholder}
      theme="LIGHT"
      multiple={true}
      min={0}
      max={1}
      disableBorderRadius={true}
      mode="BADGE"
      badgeDotColors={[
        "#e76f51",
        "#00b4d8",
        "#e9c46a",
        "#e76f51",
        "#8ac926",
        "#00b4d8",
        "#e9c46a",
        "#e76f51",
        "#00b4d8",
        "#e9c46a",
        "#e76f51",
        "#8ac926",
        "#00b4d8",
        "#e9c46a",
        "#8ac926",
        "#00b4d8",
        "#e9c46a",
      ]}
      textStyle={{ fontFamily: "Pretendard", letterSpacing: -1 }}
      containerStyle={containerStyle}
    />
  );
}
