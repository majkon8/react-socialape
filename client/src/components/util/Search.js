import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import MyButton from "./MyButton";
// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
// Redux
import { connect } from "react-redux";

const styles = (theme) => ({
  ...theme.spreadThis,
  root: {
    padding: "1px 4px",
    display: "flex",
    alignItems: "center",
    width: 300,
  },
  input: { marginLeft: theme.spacing(1), flex: 1 },
  iconButton: { padding: 10 },
  divider: { height: 28, margin: 4 },
});

function Search({ classes, isToggledSearchForUsers }) {
  const [inputValue, setInputValue] = useState("");
  const searchRef = useRef();

  const handleChange = (event) => setInputValue(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputValue.length < 3) return;
    searchRef.current.click();
  };

  const searchButton =
    inputValue.length > 2 ? (
      <Link
        ref={searchRef}
        to={
          isToggledSearchForUsers
            ? `/users/search/${inputValue}`
            : `/screams/search/${inputValue}`
        }
      >
        <MyButton btnClassName={classes.iconButton} tip="Search">
          <SearchIcon style={{ color: "#d84315" }} />
        </MyButton>
      </Link>
    ) : (
      <IconButton className={classes.iconButton} disabled={true}>
        <SearchIcon style={{ color: "grey" }} />
      </IconButton>
    );

  return (
    <Paper onSubmit={handleSubmit} component="form" className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Search SocialApe"
        inputProps={{ className: classes.input }}
        value={inputValue}
        onChange={handleChange}
      />
      <Divider className={classes.divider} orientation="vertical" />
      {searchButton}
    </Paper>
  );
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
  isToggledSearchForUsers: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isToggledSearchForUsers: state.UI.isToggledSearchForUsers,
});

export default connect(mapStateToProps)(withStyles(styles)(Search));
