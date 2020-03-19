import React, { Component } from "react";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";
import Tag from "../util/Tag";
// Redux
import { connect } from "react-redux";
import { postScream, clearErrors } from "../../redux/actions/dataActions";
// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
// Icons
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

const styles = theme => ({
  ...theme.spreadThis,
  submitButton: { float: "right" },
  progressSpinner: { position: "absolute" },
  closeButton: { position: "absolute", left: "91%", top: "2%" },
  tagInput: { width: 100 },
  addButton: { marginLeft: 2, position: "relative", bottom: 4 },
  tagsContainer: { display: "flex", flexWrap: "wrap", marginBottom: 10 }
});

class PostScream extends Component {
  state = { open: false, body: "", errors: {}, tags: [], currentTag: "" };

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.UI.errors) return { errors: nextProps.UI.errors };
    return { errors: {} };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.UI.loading && !this.props.UI.loading && !this.props.UI.errors)
      this.handleClose();
  }

  handleOpen = () => this.setState({ open: true });

  handleClose = () => {
    this.props.clearErrors();
    this.setState({ open: false, body: "" });
  };

  handleChange = event => {
    if (event.target.name === "body" && event.target.value.length > 280) return;
    else if (
      this.state[event.target.name] === "" &&
      event.target.value.trim() === ""
    )
      return;
    else if (
      event.target.name === "currentTag" &&
      event.target.value.length > 12
    )
      return;
    else this.setState({ [event.target.name]: event.target.value });
  };

  addTag = () => {
    const { tags, currentTag } = this.state;
    if (
      tags.includes(currentTag) ||
      currentTag.length === 0 ||
      tags.length === 6
    )
      return;
    this.setState(state => ({
      tags: [...state.tags, state.currentTag.trim()],
      currentTag: ""
    }));
  };

  removeTag = tagName =>
    this.setState(state => {
      const updatedTags = state.tags.filter(tag => tag !== tagName);
      return { tags: [...updatedTags] };
    });

  handleSubmit = event => {
    event.preventDefault();
    this.props.postScream({ body: this.state.body });
  };

  render() {
    const { errors, body, currentTag, tags } = this.state;
    const {
      classes,
      UI: { loading }
    } = this.props;
    const charactersLeftMarkup = (
      <div style={{ float: "right" }}>
        Characters left:{" "}
        <span style={{ color: body.length === 280 ? "red" : "green" }}>
          {280 - body.length}
        </span>
      </div>
    );
    return (
      <>
        <MyButton onClick={this.handleOpen} tip="Post a Scream!">
          <AddIcon />
        </MyButton>
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
          <DialogTitle>Post a new scream</DialogTitle>
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
                onClick={this.addTag}
                btnClassName={classes.addButton}
                tip="Add tag"
              >
                <AddIcon />
              </MyButton>
              <div className={classes.tagsContainer}>
                {tags.map(tag => (
                  <Tag key={tag} tagName={tag} removeTag={this.removeTag} />
                ))}
              </div>
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

postScream.propTypes = {
  postScream: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({ UI: state.UI });

const mapActionsToProps = { postScream, clearErrors };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(PostScream));
