import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ProfilesDisplay from "../components/util/ProfilesDisplay";
import Switch from "../components/util/Switch";
import ScreamsDisplay from "../components/util/ScreamsDisplay";
// Redux
import { connect } from "react-redux";
import { searchForUsers, searchForScreams } from "../redux/actions/dataActions";
import { toggleSearchForUsers } from "../redux/actions/uiActions";

function Search({
  match,
  history,
  data: { searchedUsers, loading, searchedScreams },
  isToggledSearchForUsers,
  searchForUsers,
  toggleSearchForUsers,
  searchForScreams,
}) {
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    if (match.path.includes("users")) {
      if (!isToggledSearchForUsers) toggleSearchForUsers();
      const name = match.params.name;
      setSearchString(name);
      searchForUsers(name);
    } else {
      if (isToggledSearchForUsers) toggleSearchForUsers();
      const tag = match.params.tag;
      setSearchString(tag);
      searchForScreams(tag);
    }
  }, [match.params.name, match.params.tag]);

  const handleSwitch = () => {
    toggleSearchForUsers();
    if (match.path.includes("users")) {
      history.push(`/screams/search/${searchString}`);
    } else {
      history.push(`/users/search/${searchString}`);
    }
  };

  return (
    <>
      <Switch
        handleChange={handleSwitch}
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

Search.propTypes = {
  data: PropTypes.object.isRequired,
  searchForUsers: PropTypes.func.isRequired,
  toggleSearchForUsers: PropTypes.func.isRequired,
  isToggledSearchForUsers: PropTypes.bool.isRequired,
  searchForScreams: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
  isToggledSearchForUsers: state.UI.isToggledSearchForUsers,
});

const mapActionsToProps = {
  searchForUsers,
  searchForScreams,
  toggleSearchForUsers,
};

export default connect(mapStateToProps, mapActionsToProps)(Search);
