import React, { Component } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

class SelectDropdown extends Component {
  onChange = e => {
    const { onChange } = this.props;
    onChange && onChange(e.target.value);
  }

  render () {
    const { name, id, options, value, placeholder } = this.props;

    return (
      <Select
        style={{
          alignSelf: "stretch",
          margin: "10px 0"
        }}
        value={value}
        onChange={this.onChange}
        inputProps={{ name, id }}
        placeholder={placeholder}
      >
        {options.map((option, i) => (
          <MenuItem key={`${i}`} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    );
  }
}

export default SelectDropdown;
