import React from 'react';

class GroupPanelEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    //binding functions here
  }

  render() {
    return (
      <div className="grouppanelentry">
        Proof of group panel entry
        <ContactEntry />
      </div>

    );
  }
}

export default GroupPanelEntry;