import React, { Component } from "react";
import Switch from "react-switch";
 
class NavbarSwitch extends Component {
  constructor() {
    super();
    this.state = { checked: true };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.setState({checked : JSON.parse(localStorage.getItem("isGuardian"))})
  }
  handleChange(checked) {
    this.setState({ checked: checked });
    localStorage.setItem("isGuardian", checked);
    window.location.reload();
  }
 
  render() {
    return (
        <Switch onColor={'#1E90FF'}uncheckedIcon={false} checkedIcon={false} onChange={this.handleChange} checked={this.state.checked} />
    );
  }
}

export default NavbarSwitch;