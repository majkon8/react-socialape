import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";
import NewPasswordForm from "./NewPasswordForm";
// Redux
import { connect } from "react-redux";
import {
  editUserDetails,
  uploadUserImage,
} from "../../redux/actions/userActions";
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

function EditDetails({
  editUserDetails,
  classes,
  uploadUserImage,
  clearErrors,
  clearSuccesses,
  credentials,
}) {
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [open, setOpen] = useState(false);
  const [newPasswordFormIsOpen, setNewPasswordFormIsOpen] = useState(false);

  useEffect(() => mapUserDetailsToState(credentials), []);

  const handleOpen = () => {
    setOpen(true);
    mapUserDetailsToState(credentials);
  };

  const handleChange = (event, state, setState) => {
    if (event.target.name === "bio" && event.target.value.length > 80) return;
    if (state === "" && event.target.value.trim() === "") return;
    if (
      (event.target.name === "website" || event.target.name === "location") &&
      event.target.value.length > 30
    )
      return;
    if (event.target.name === "nickname" && event.target.value.length > 20)
      return;
    setState(event.target.value);
  };

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    uploadUserImage(formData);
  };

  const handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  const mapUserDetailsToState = (credentials) => {
    const { bio, website, location, nickname } = credentials;
    bio && setBio(bio);
    website && setWebsite(website);
    location && setLocation(location);
    nickname && setNickname(nickname);
  };

  const handleClose = () => {
    setOpen(false);
    setNewPasswordFormIsOpen(false);
    clearErrors();
    clearSuccesses();
  };

  const handleSubmit = () => {
    const userDetails = { bio, website, location, nickname };
    editUserDetails(userDetails);
    handleClose();
  };

  const togglePasswordForm = () =>
    setNewPasswordFormIsOpen(!newPasswordFormIsOpen);

  const charactersLeftMarkup = bio && (
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
        onClick={handleOpen}
        btnClassName={classes.button}
      >
        <EditIcon color="primary" />
      </MyButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
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
              onChange={(e) => handleChange(e, nickname, setNickname)}
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
              onChange={(e) => handleChange(e, bio, setBio)}
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
              onChange={(e) => handleChange(e, website, setWebsite)}
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
              onChange={(e) => handleChange(e, location, setLocation)}
              fullWidth
            />
            <input
              type="file"
              id="imageInput"
              hidden="hidden"
              onChange={handleImageChange}
            />
            <MyButton onClick={handleEditPicture} tip="Edit profile image">
              <ImageIcon color="primary" />
            </MyButton>
          </form>
          <p
            style={{
              cursor: "pointer",
              color: "#00bcd4",
              marginBottom: 0,
              marginTop: 7,
            }}
            onClick={togglePasswordForm}
          >
            Change password
          </p>
          {newPasswordFormIsOpen && <NewPasswordForm />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

EditDetails.propTypes = {
  editUserDetails: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  uploadUserImage: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  clearSuccesses: PropTypes.func.isRequired,
  credentials: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ credentials: state.user.credentials });

const mapActionsToProps = {
  editUserDetails,
  uploadUserImage,
  clearErrors,
  clearSuccesses,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(EditDetails));
