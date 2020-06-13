import React, { Component } from "react";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";
import Tag from "../util/Tag";
import axios from "axios";
// Redux
import { connect } from "react-redux";
import {
  postScream,
  clearErrors,
  replyToScream,
} from "../../redux/actions/dataActions";
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
  closeButton: { position: "absolute", left: "91%", top: "2%" },
  tagInput: { width: 100 },
  addButton: { marginLeft: 2, position: "relative", bottom: 4 },
  tagsContainer: { display: "flex", flexWrap: "wrap" },
});

class PostScream extends Component {
  state = {
    open: false,
    body: "",
    errors: {},
    tags: [],
    currentTag: "",
    imageUrl: "",
    loadingImage: false,
  };

  imgInputRef = React.createRef();

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.UI.errors) return { errors: nextProps.UI.errors };
    return { errors: {} };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.UI.loading && !this.props.UI.loading && !this.props.UI.errors)
      this.handleClose();
  }

  uploadScreamImage = (formData) => {
    this.setState({ loadingImage: true });
    axios
      .post("/scream/image", formData)
      .then((res) => this.setState({ imageUrl: res.data.imageUrl }))
      .catch((err) => console.log(err))
      .finally(() => this.setState({ loadingImage: false }));
  };

  handleOpen = () => this.setState({ open: true });

  handleClose = () => {
    this.props.clearErrors();
    this.setState({
      open: false,
      body: "",
      tags: [],
      currentTag: "",
    });
    this.handleImageRemove();
  };

  handleChange = (event) => {
    if (event.target.name === "body" && event.target.value.length > 280) return;
    else if (
      this.state[event.target.name] === "" &&
      event.target.value.trim() === ""
    )
      return;
    else if (
      event.target.name === "currentTag" &&
      (event.target.value.length > 12 ||
        /[^A-Za-z0-9]+/.test(event.target.value))
    )
      return;
    else this.setState({ [event.target.name]: event.target.value });
  };

  handleTagAdd = () => {
    const { tags, currentTag } = this.state;
    if (
      tags.includes(currentTag) ||
      currentTag.length === 0 ||
      tags.length === 6
    )
      return;
    this.setState((state) => ({
      tags: [...state.tags, state.currentTag.trim().toLowerCase()],
      currentTag: "",
    }));
  };

  handleTagRemove = (tagName) =>
    this.setState((state) => {
      const updatedTags = state.tags.filter((tag) => tag !== tagName);
      return { tags: [...updatedTags] };
    });

  handleAddPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  handleImageAdd = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    this.uploadScreamImage(formData);
  };

  handleImageRemove = () => {
    if (this.imgInputRef.current) this.imgInputRef.current.value = null;
    this.setState({ imageUrl: "" });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { body, tags, imageUrl } = this.state;
    const { replyScreamData } = this.props;
    replyScreamData
      ? this.props.replyToScream({ body, tags, imageUrl, replyScreamData })
      : this.props.postScream({ body, tags, imageUrl });
  };

  render() {
    const {
      errors,
      body,
      currentTag,
      tags,
      imageUrl,
      loadingImage,
    } = this.state;
    const {
      classes,
      UI: { loading },
      replyScreamData,
    } = this.props;
    const charactersLeftMarkup = (
      <div style={{ float: "right" }}>
        Characters left:{" "}
        <span style={{ color: body.length === 280 ? "red" : "green" }}>
          {280 - body.length}
        </span>
      </div>
    );
    const icon = replyScreamData ? (
      <MyButton onClick={this.handleOpen} tip="Reply">
        <ReplyIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton onClick={this.handleOpen} tip="Post a Scream!">
        <AddIcon />
      </MyButton>
    );
    return (
      <>
        {icon}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton
            tip="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
          <DialogTitle>
            {replyScreamData ? "Reply to scream" : "Post a new scream"}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                name="body"
                type="text"
                multiline
                rows="5"
                label="Scream content"
                error={errors.body ? true : false}
                helperText={errors.body}
                className={classes.textField}
                onChange={this.handleChange}
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
                onChange={this.handleChange}
                value={currentTag}
                error={errors.tag ? true : false}
                helperText={errors.tag}
              ></TextField>
              <MyButton
                onClick={this.handleTagAdd}
                btnClassName={classes.addButton}
                tip="Add tag (max 6)"
              >
                <AddIcon />
              </MyButton>
              <div className={classes.tagsContainer}>
                {tags.map((tag) => (
                  <Tag
                    key={tag}
                    tagName={tag}
                    removeTag={this.handleTagRemove}
                  />
                ))}
              </div>
              <input
                onChange={this.handleImageAdd}
                type="file"
                id="imageInput"
                hidden="hidden"
                ref={this.imgInputRef}
              />
              {!imageUrl && (
                <MyButton
                  style={{ marginBottom: 5 }}
                  onClick={this.handleAddPicture}
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
                    onClick={this.handleImageRemove}
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
                disabled={loading || body.trim() === ""}
              >
                Submit
                {loading && (
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
