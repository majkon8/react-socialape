import React, { Component } from "react";
import PropTypes from "prop-types";
import ProfilesDisplay from "../components/util/ProfilesDisplay";
import Switch from "../components/util/Switch";
import ScreamsDisplay from "../components/util/ScreamsDisplay";
// Redux
import { connect } from "react-redux";
import { searchForUsers, searchForScreams } from "../redux/actions/dataActions";
import { toggleSearchForUsers } from "../redux/actions/uiActions";

export class search extends Component {
  state = { searchString: "" };

  componentDidMount() {
    if (this.props.match.path.includes("users")) {
      if (!this.props.isToggledSearchForUsers)
        this.props.toggleSearchForUsers();
      const name = this.props.match.params.name;
      this.setState({ searchString: name });
      this.props.searchForUsers(name);
    } else {
      if (this.props.isToggledSearchForUsers) this.props.toggleSearchForUsers();
      const tag = this.props.match.params.tag;
      this.setState({ searchString: tag });
      this.props.searchForScreams(tag);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.path.includes("users")) {
      const prevName = prevProps.match.params.name;
      const name = this.props.match.params.name;
      if (prevName !== name) {
        this.setState({ searchString: name });
        this.props.searchForUsers(name);
      }
    } else {
      const prevTag = prevProps.match.params.tag;
      const tag = this.props.match.params.tag;
      if (prevTag !== tag) {
        this.setState({ searchString: tag });
        this.props.searchForScreams(tag);
      }
    }
  }

  handleSwitch = () => {
    this.props.toggleSearchForUsers();
    const { searchString } = this.state;
    if (this.props.match.path.includes("users")) {
      this.props.history.push(`/screams/search/${searchString}`);
    } else {
      this.props.history.push(`/users/search/${searchString}`);
    }
  };

  render() {
    const {
      data: { searchedUsers, loading, searchedScreams },
      isToggledSearchForUsers
    } = this.props;
    return (
      <>
        <Switch
          handleChange={this.handleSwitch}
          searchForUsers={isToggledSearchForUsers}
        />
        {isToggledSearchForUsers ? (
          <ProfilesDisplay users={searchedUsers} loading={loading} />
        ) : (
          <ScreamsDisplay loading={loading} screams={searchedScreams} />
        )}
      </>
    );
  }
}

search.propTypes = {
  data: PropTypes.object.isRequired,
  searchForUsers: PropTypes.func.isRequired,
  toggleSearchForUsers: PropTypes.func.isRequired,
  isToggledSearchForUsers: PropTypes.bool.isRequired,
  searchForScreams: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  data: state.data,
  isToggledSearchForUsers: state.UI.isToggledSearchForUsers
});

const mapActionsToProps = {
  searchForUsers,
  searchForScreams,
  toggleSearchForUsers
};

export default connect(mapStateToProps, mapActionsToProps)(search);
