import React from 'react';
import GroupPanelEntry from './GroupPanelEntry.jsx';
import ContactEntry from './ContactEntry.jsx';
import $ from 'jquery';
import {deleteGroup} from '../models/user.js';

class GroupPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addContact: false,
      addGroup: false,
      addContactToGroup: false,
    }
    //binding functions here
    this.handleAddContact = this.handleAddContact.bind(this);
    this.handleAddGroup = this.handleAddGroup.bind(this);
    this.willAddContact = this.willAddContact.bind(this);
    this.willAddGroup = this.willAddGroup.bind(this);
    this.handleDeleteGroup = this.handleDeleteGroup.bind(this);
    // this.handleUpdateGroup = this.handleUpdateGroup.bind(this);
  }

  willAddContact() {
    // console.log(this.state.addContact)
    this.setState({
      addContact: !this.state.addContact      
    })
  }

  willAddGroup() {
    this.setState({
      addGroup: !this.state.addGroup
    })
  }

  // handleAddGroup(groupname) {
  //   this._groupName.value = '';
  //   this.props.addGroup(groupname);
  //   // console.log('cant add a group yet', groupname)
  // }

  handleDeleteGroup(group) {
    deleteGroup(group, this.props.resetSide);
  }

  // handleAddContact(contactmail) {
  //   this.props.addContact(contactmail);
  //   console.log('cant add a contact yet', contactmail)
  // }

  // handleUpdateGroup() {
  //   this.props.clearSelectedContacts();

  handleAddGroup(e) {
    e.preventDefault();
    if (!e.target.groupname.value) {
      alert('Error: Please enter a valid group name.');
    } else if (e.target.groupname.value.length > 20) {
      alert('Error: Group name can not be over 20 characters.')
    } else {
      this.props.addGroup(e.target.groupname.value);
    }
    e.target.groupname.value = '';
    // console.log('cant add a group yet', groupname)
  }

  handleAddContact(e) {
    e.preventDefault();
    //console.log(e.target.contactmail.value, 'THIS?')
    this.props.addContactFn(e.target.contactmail.value);
    e.target.contactmail.value = '';
    //console.log('cant add a contact yet', $('.contactmail').val())
  }
  //reason why e is better than using jquery - there may be some default action taken by react(or who knows what)
  //that will re-render on click and nothing was added to the database



  render() {
    return (
      <div className="grouppanel">
        { this.props.isContactList && <h3 style={{display: 'inline'}}> CONTACTS </h3>}
        { this.props.isContactList && <button className="addbutton" onClick={this.willAddContact}> <i className="fa fa-user-plus" aria-hidden="true"></i> </button>}
        { this.state.addContact && <form onSubmit={this.handleAddContact}> 
          Contact g-mail: <input  className="contactmail" name="contactmail" type="text" />
          <input className="submit" type="submit" value="Submit"/>
          </form>}
        { this.props.isContactList && this.props.contacts.map((contact) => <ContactEntry contact={contact} selectContact={this.props.selectContact} selectedContacts={this.props.selectedContacts}/>) }



        { !this.props.isContactList && <h3 style={{display: 'inline'}}> GROUP LIST </h3>}
        { !this.props.isContactList && 
          <button className="addbutton" onClick={this.willAddGroup}> <i className="fa fa-users" aria-hidden="true"></i> </button> }
        { this.state.addGroup && <form onSubmit={this.handleAddGroup}> 
          Group Name: <input className="groupname" name="groupname" type="text" />
          <input className="submit" type="submit" value="Add Group" />
          </form>}
        { !this.props.isContactList && this.props.groups.map((group) => <GroupPanelEntry group={group} selectContact={this.props.selectContact} selectGroup={this.props.selectGroup} updateGroup={this.props.updateGroup} removeContactFromGroup={this.props.removeContactFromGroup} deleteGroup={this.handleDeleteGroup}/>)}
      </div>

    );
  }
}

//need a .map function to render multiple entries

export default GroupPanel;