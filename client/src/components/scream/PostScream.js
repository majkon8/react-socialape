import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";
import Tag from "../util/Tag";
import axios from "axios";
// Redux
import { connect } from "react-redux";
import { postScream, replyToScream } from "../../redux/actions/dataActions";
import { clearErrors } from "../../redux/actions/uiActions";
// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";
// Icons
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import ImageIcon from "@material-ui/icons/Image";
import ReplyIcon from "@material-ui/icons/Reply";

const styles = (theme) => ({
  ...theme.spreadThis,
  submitButton: { float: "right" },
  progressSpinner: { position: "absolute" },
  closeButton: { position: "absolute", right: "0", top: "0" },
  tagInput: { width: 100 },
  addButton: { marginLeft: 2, position: "relative", bottom: 4 },
  tagsContainer: { display: "flex", flexWrap: "wrap" },
});

function PostScream({
  postScream,
  replyToScream,
  clearErrors,
  UI,
  classes,
  replyScreamData,
  showIcon,
}) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const imgInputRef = useRef();

  useEffect(() => {
    if (!UI.loading && !UI.errors) handleClose();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [UI.loading]);

  const handleResize = () => setWindowWidth(window.innerWidth);

  const uploadScreamImage = async (formData) => {
    setLoadingImage(true);
    try {
      const res = await axios.post("/scream/image", formData);
      setImageUrl(res.data.imageUrl);
    } finally {
      setLoadingImage(false);
    }
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    clearErrors();
    setOpen(false);
    setBody("");
    setTags([]);
    setCurrentTag("");
    handleImageRemove();
  };

  const handleChange = (event, state, setState) => {
    if (event.target.name === "body" && event.target.value.length > 280) return;
    else if (state === "" && event.target.value.trim() === "") return;
    else if (
      event.target.name === "currentTag" &&
      (event.target.value.length > 12 ||
        /[^A-Za-z0-9]+/.test(event.target.value))
    )
      return;
    else setState(event.target.value);
  };

  const handleTagAdd = () => {
    if (
      tags.includes(currentTag) ||
      currentTag.length === 0 ||
      tags.length === 6
    )
      return;
    setTags([...tags, currentTag.trim().toLowerCase()]);
    setCurrentTag("");
  };

  const handleTagRemove = (tagName) => {
    const updatedTags = tags.filter((tag) => tag !== tagName);
    setTags(updatedTags);
  };

  const handleAddPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  const handleImageAdd = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    uploadScreamImage(formData);
  };

  const handleImageRemove = () => {
    if (imgInputRef.current) imgInputRef.current.value = null;
    setImageUrl("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    replyScreamData
      ? replyToScream({ body, tags, imageUrl, replyScreamData })
      : postScream({ body, tags, imageUrl });
  };

  const charactersLeftMarkup = (
    <div style={{ float: "right" }}>
      Characters left:{" "}
      <span style={{ color: body.length === 280 ? "red" : "green" }}>
        {280 - body.length}
      </span>
    </div>
  );

  const icon = replyScreamData ? (
    <MyButton onClick={handleOpen} tip="Reply">
      <ReplyIcon color="primary" />
    </MyButton>
  ) : (
    <MyButton onClick={handleOpen} tip="Post a Scream!">
      <AddIcon />
    </MyButton>
  );

  return (
    <>
      {showIcon ? (
        icon
      ) : (
        <p style={{ margin: 0 }} onClick={handleOpen}>
          Post scream
        </p>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={windowWidth < 600 ? true : false}
        fullWidth
        maxWidth="md"
      >
        <MyButton
          tip="Close"
          onClick={handleClose}
          tipClassName={classes.closeButton}
        >
          <CloseIcon />
        </MyButton>
        <DialogTitle>
          {replyScreamData ? "Reply to scream" : "Post a new scream"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              name="body"
              type="text"
              multiline
              rows="5"
              label="Scream content"
              error={UI.errors && UI.errors.body ? true : false}
              helperText={UI.errors && UI.errors.body}
              className={classes.textField}
              onChange={(e) => handleChange(e, body, setBody)}
              value={body}
              fullWidth
            />
            {charactersLeftMarkup}
            <TextField
              variant="outlined"
              name="currentTag"
              type="text"
              size="small"
              label="Tag"
              className={classes.tagInput}
              onChange={(e) => handleChange(e, currentTag, setCurrentTag)}
              value={currentTag}
              error={UI.errors && UI.errors.tag ? true : false}
              helperText={UI.errors && UI.errors.tag}
            ></TextField>
            <MyButton
              onClick={handleTagAdd}
              btnClassName={classes.addButton}
              tip="Add tag (max 6)"
            >
              <AddIcon />
            </MyButton>
            <div className={classes.tagsContainer}>
              {tags.map((tag) => (
                <Tag key={tag} tagName={tag} removeTag={handleTagRemove} />
              ))}
            </div>
            <input
              onChange={handleImageAdd}
              type="file"
              id="imageInput"
              hidden="hidden"
              ref={imgInputRef}
            />
            {!imageUrl && (
              <MyButton
                style={{ marginBottom: 5 }}
                onClick={handleAddPicture}
                tip="Add image"
              >
                <ImageIcon
                  style={{ color: loadingImage ? "transparent" : "#d84315" }}
                />

                {loadingImage && (
                  <CircularProgress size={30} className={classes.progress} />
                )}
              </MyButton>
            )}
            {imageUrl && (
              <Tooltip title="Click to remove image">
                <img
                  onClick={handleImageRemove}
                  className={classes.imgPreview}
                  src={imageUrl}
                  alt="Scream image"
                />
              </Tooltip>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submitButton}
              disabled={UI.loading || body.trim() === ""}
            >
              Submit
              {UI.loading && (
                <CircularProgress
                  size={30}
                  className={classes.progressSpinner}
                />
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

PostScream.propTypes = {
  postScream: PropTypes.func.isRequired,
  replyToScream: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  replyScreamData: PropTypes.object,
};

const mapStateToProps = (state) => ({ UI: state.UI });

const mapActionsToProps = { postScream, clearErrors, replyToScream };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(PostScream));
