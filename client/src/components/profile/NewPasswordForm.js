import React, { useState } from "react";
import PropTypes from "prop-types";
// Redux
import { connect } from "react-redux";
import { changePassword } from "../../redux/actions/userActions";
// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = (theme) => ({ ...theme.spreadThis });

function NewPasswordForm({
  classes,
  changePassword,
  UI: { errors, successes, loading },
}) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleChange = (event, setState) => setState(event.target.value);

  const handlePasswordChange = () => {
    const credentials = { oldPassword, newPassword, confirmNewPassword };
    changePassword(credentials);
  };

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
        onChange={(e) => handleChange(e, setOldPassword)}
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
        onChange={(e) => handleChange(e, setNewPassword)}
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
        onChange={(e) => handleChange(e, setConfirmNewPassword)}
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
      <Button
        variant="contained"
        onClick={handlePasswordChange}
        style={{ height: 40, width: 50 }}
      >
        {loading ? (
          <CircularProgress size={30} className={classes.progress} />
        ) : (
          "Save"
        )}
      </Button>
    </form>
  );
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
