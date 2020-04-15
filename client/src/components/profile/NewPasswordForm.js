import React, { Component } from "react";
import PropTypes from "prop-types";
// Redux
import { connect } from "react-redux";
import { changePassword } from "../../redux/actions/userActions";
// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({ ...theme.spreadThis });

export class NewPasswordForm extends Component {
  state = { oldPassword: "", newPassword: "", confirmNewPassword: "" };

  handleChange = (event) =>
    this.setState({ [event.target.name]: event.target.value });

  handlePasswordChange = () => {
    const { oldPassword, newPassword, confirmNewPassword } = this.state;
    const credentials = { oldPassword, newPassword, confirmNewPassword };
    this.props.changePassword(credentials);
  };

  render() {
    const {
      classes,
      UI: { errors, successes },
    } = this.props;
    const { oldPassword, newPassword, confirmNewPassword } = this.state;
    return (
      <form>
        <TextField
          variant="outlined"
          name="oldPassword"
          type="password"
          label="Old password"
          error={errors && errors.password ? true : false}
          helperText={errors && errors.password}
          className={classes.textField}
          value={oldPassword}
          onChange={this.handleChange}
          fullWidth
        />
        <TextField
          variant="outlined"
          name="newPassword"
          type="password"
          label="New password"
          error={errors && errors.newPassword ? true : false}
          helperText={errors && errors.newPassword}
          className={classes.textField}
          value={newPassword}
          onChange={this.handleChange}
          fullWidth
        />
        <TextField
          variant="outlined"
          name="confirmNewPassword"
          type="password"
          label="Repeat new password"
          error={errors && errors.confirmNewPassword ? true : false}
          helperText={errors && errors.confirmNewPassword}
          className={classes.textField}
          value={confirmNewPassword}
          onChange={this.handleChange}
          fullWidth
        />
        {errors && errors.general && (
          <Typography variant="body2" className={classes.customError}>
            {errors.general}
          </Typography>
        )}
        {successes && (
          <Typography
            variant="body2"
            style={{ color: "green", marginBottom: 10 }}
          >
            {successes.success}
          </Typography>
        )}
        <Button variant="contained" onClick={this.handlePasswordChange}>
          Save
        </Button>
      </form>
    );
  }
}

NewPasswordForm.propTypes = {
  classes: PropTypes.object.isRequired,
  changePassword: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  UI: state.UI,
});

const mapActionsToProps = { changePassword };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(NewPasswordForm));
