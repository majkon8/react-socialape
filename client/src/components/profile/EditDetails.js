import React, { Component } from "react";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";
import NewPasswordForm from "./NewPasswordForm";
// Redux
import { connect } from "react-redux";
import { editUserDetails, uploadImage } from "../../redux/actions/userActions";
import { clearErrors, clearSuccesses } from "../../redux/actions/uiActions";
// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// Icons
import EditIcon from "@material-ui/icons/Edit";
import ImageIcon from "@material-ui/icons/Image";

const styles = (theme) => ({
  ...theme.spreadThis,
  button: { position: "absolute", zIndex: 1 },
});

export class EditDetails extends Component {
  state = {
    nickname: "",
    bio: "",
    website: "",
    location: "",
    open: false,
    newPasswordFormIsOpen: false,
  };

  componentDidMount() {
    this.mapUserDetailsToState(this.props.credentials);
  }

  handleOpen = () => {
    this.setState({ open: true });
    this.mapUserDetailsToState(this.props.credentials);
  };

  handleChange = (event) => {
    if (event.target.name === "bio" && event.target.value.length > 80) return;
    if (
      this.state[event.target.name] === "" &&
      event.target.value.trim() === ""
    )
      return;
    if (
      (event.target.name === "website" || event.target.name === "location") &&
      event.target.value.length > 30
    )
      return;
    if (event.target.name === "nickname" && event.target.value.length > 20)
      return;
    this.setState({ [event.target.name]: event.target.value });
  };

  handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    this.props.uploadImage(formData);
  };

  handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  mapUserDetailsToState = (credentials) => {
    this.setState({
      bio: credentials.bio && credentials.bio,
      website: credentials.website && credentials.website,
      location: credentials.location && credentials.location,
      nickname: credentials.nickname && credentials.nickname,
    });
  };

  handleClose = () => {
    this.setState({ open: false, newPasswordFormIsOpen: false });
    this.props.clearErrors();
    this.props.clearSuccesses();
  };

  handleSubmit = () => {
    const userDetails = {
      bio: this.state.bio,
      website: this.state.website,
      location: this.state.location,
      nickname: this.state.nickname,
    };
    this.props.editUserDetails(userDetails);
    this.handleClose();
  };

  togglePasswordForm = () =>
    this.setState((state) => ({
      newPasswordFormIsOpen: !state.newPasswordFormIsOpen,
    }));

  render() {
    const { classes } = this.props;
    const {
      nickname,
      bio,
      website,
      location,
      open,
      newPasswordFormIsOpen,
    } = this.state;
    const charactersLeftMarkup = (
      <div style={{ float: "right" }}>
        Characters left:{" "}
        <span style={{ color: bio.length === 80 ? "red" : "green" }}>
          {80 - bio.length}
        </span>
      </div>
    );
    return (
      <>
        <MyButton
          tip="Edit details"
          onClick={this.handleOpen}
          btnClassName={classes.button}
        >
          <EditIcon color="primary" />
        </MyButton>
        <Dialog open={open} onClose={this.handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Edit your details</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                variant="outlined"
                name="nickname"
                type="text"
                label="Nickname"
                placeholder="Nickname"
                className={classes.textField}
                value={nickname}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                variant="outlined"
                name="bio"
                type="text"
                label="Bio"
                multiline
                rows="3"
                placeholder="A short bio about yourself"
                className={classes.textField}
                value={bio}
                onChange={this.handleChange}
                fullWidth
              />
              {charactersLeftMarkup}
              <TextField
                variant="outlined"
                name="website"
                type="text"
                label="Website"
                placeholder="Your personal/proffesional website"
                className={classes.textField}
                value={website}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                variant="outlined"
                name="location"
                type="text"
                label="Location"
                placeholder="Where you live"
                className={classes.textField}
                value={location}
                onChange={this.handleChange}
                fullWidth
              />
              <input
                type="file"
                id="imageInput"
                hidden="hidden"
                onChange={this.handleImageChange}
              />
              <MyButton
                onClick={this.handleEditPicture}
                tip="Edit profile image"
              >
                <ImageIcon color="primary" />
              </MyButton>
            </form>
            <a style={{ cursor: "pointer" }} onClick={this.togglePasswordForm}>
              Change password
            </a>
            {newPasswordFormIsOpen && <NewPasswordForm />}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

EditDetails.propTypes = {
  editUserDetails: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  uploadImage: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  clearSuccesses: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ credentials: state.user.credentials });

const mapActionsToProps = {
  editUserDetails,
  uploadImage,
  clearErrors,
  clearSuccesses,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(EditDetails));
