import Footer from "./Footer";
import React, { Component } from "react";

class Layout extends Component {
  render() {
    return (
      <div>
        {this.props.children}
        <div style={{ height: "70px" }} />
        <Footer />
      </div>
    );
  }
}

export default Layout;
