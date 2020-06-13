import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../util/MyButton";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";
import ShareButton from "./ShareButton";
// MUI
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
// Icons
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";
import ChatIcon from "@material-ui/icons/Chat";
// Redux
import { connect } from "react-redux";
import { getScream, clearErrors } from "../../redux/actions/dataActions";

const styles = (theme) => ({
  ...theme.spreadThis,
  profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: "50%",
    objectFit: "cover",
  },
  dialogContent: { padding: 20 },
  closeButton: { position: "absolute", left: "90%" },
  expandButton: { position: "absolute", left: "90%" },
  spinnerDiv: { textAlign: "center", marginTop: 50, marginBottom: 50 },
});

export class ScreamDialog extends Component {
  state = { open: false, oldPath: "", newPath: "" };

  componentDidMount() {
    if (this.props.openDialog) this.handleOpen();
  }

  handleOpen = () => {
    let oldPath = window.location.pathname;
    const { userHandle, screamId } = this.props;
    const newPath = `/users/${userHandle}/scream/${screamId}`;
    if (oldPath === newPath) oldPath = `/users/${userHandle}`;
    window.history.pushState(null, null, newPath);
    this.setState({ open: true, oldPath, newPath });
    this.props.getScream(this.props.screamId);
  };

  handleClose = () => {
    window.history.pushState(null, null, this.state.oldPath);
    this.setState({ open: false });
    this.props.clearErrors();
  };

  render() {
    const {
      classes,
      scream,
      scream: {
        screamId,
        body,
        createdAt,
        likeCount,
        commentCount,
        userImage,
        userHandle,
        comments,
        userNickname,
        imageUrl,
        sharedFromHandle,
        sharedFromNickname,
        sharedScreamId,
        shares,
        repliedScreamBody,
        repliedScreamId,
        replyToHandle,
        replyToNickname,
      },
      UI: { loading },
    } = this.props;

    const dialogMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress size={200} thickness={2} />
      </div>
    ) : (
      <Grid container spacing={2}>
        {sharedFromHandle && (
          <Typography variant="body2" className={classes.shareInfo}>
            <Typography
              variant="body2"
              component={Link}
              to={`/users/${userHandle}/scream/${sharedScreamId}`}
            >
              Scream
            </Typography>{" "}
            shared by{" "}
            <Typography
              variant="body2"
              component={Link}
              to={`/users/${userHandle}`}
            >
              {userNickname}
            </Typography>
          </Typography>
        )}
        <Grid item sm={5}>
          <img src={userImage} alt="Profile" className={classes.profileImage} />
        </Grid>
        <Grid item sm={7}>
          <Typography
            component={Link}
            color="primary"
            variant="h5"
            to={`/users/${sharedFromHandle ? sharedFromHandle : userHandle}`}
          >
            {sharedFromHandle ? sharedFromNickname : userNickname}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          {repliedScreamId && (
            <div className={classes.replyContent}>
              <Typography variant="body2">
                <Typography
                  variant="body2"
                  component={Link}
                  to={`/users/${replyToHandle}`}
                >
                  {replyToNickname}
                </Typography>{" "}
                <Typography
                  variant="body2"
                  component={Link}
                  to={`/users/${replyToHandle}/scream/${repliedScreamId}`}
                >
                  screamed:
                </Typography>{" "}
              </Typography>
              <Typography variant="body2">{repliedScreamBody}</Typography>
            </div>
          )}
          <Typography variant="body1">{body}</Typography>
          {imageUrl && <img src={imageUrl} alt="Scream image" />}
          <LikeButton screamId={screamId} />
          <span>{likeCount}</span>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount}</span>
          <ShareButton screamData={scream} />
          <span>{shares && shares.length}</span>
        </Grid>
        <hr className={classes.visibleSeparator} />
        <CommentForm screamId={screamId} />
        <Comments comments={comments} />
      </Grid>
    );

    return (
      <>
        <MyButton
          onClick={this.handleOpen}
          tip="Expand scream"
          tipClassName={classes.expandButton}
        >
          <UnfoldMore color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <Link to={`/users/${scream.userHandle}`}>
            <MyButton
              tip="Close"
              onClick={this.handleClose}
              tipClassName={classes.closeButton}
            >
              <CloseIcon />
            </MyButton>
          </Link>

          <DialogContent className={classes.dialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

ScreamDialog.propTypes = {
  clearErrors: PropTypes.func.isRequired,
  getScream: PropTypes.func.isRequired,
  screamId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  scream: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  openDialog: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  scream: state.data.scream,
  UI: state.UI,
});

const mapActionsToProps = { getScream, clearErrors };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(ScreamDialog));
