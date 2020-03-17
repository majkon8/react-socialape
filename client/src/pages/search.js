import React, { Component } from "react";
import PropTypes from "prop-types";
import ProfilesDisplay from "../components/util/ProfilesDisplay";
// Redux
import { connect } from "react-redux";
import { searchForUsers, setSearchedUsers } from "../redux/actions/dataActions";

export class search extends Component {
  componentDidMount() {
    const name = this.props.match.params.name;
    this.props.searchForUsers(name);
  }

  componentDidUpdate(prevProps) {
    const prevName = prevProps.match.params.name;
    const name = this.props.match.params.name;
    if (prevName !== name) this.props.searchForUsers(name);
  }

  render() {
    const { searchedUsers, loading } = this.props.data;
    return <ProfilesDisplay users={searchedUsers} loading={loading} />;
  }
}

search.propTypes = {
  data: PropTypes.object.isRequired,
  searchForUsers: PropTypes.func.isRequired,
  setSearchedUsers: PropTypes.func.isRequired
};

const mapStateToProps = state => ({ data: state.data });

const mapActionsToProps = { searchForUsers, setSearchedUsers };

export default connect(mapStateToProps, mapActionsToProps)(search);
