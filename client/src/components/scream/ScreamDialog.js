import React, { useState, useEffect } from "react";
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
import { getScream } from "../../redux/actions/dataActions";
import { clearErrors } from "../../redux/actions/uiActions";

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

function ScreamDialog({
  clearErrors,
  getScream,
  screamId,
  userHandle,
  scream,
  UI,
  openDialog,
  classes,
}) {
  const [open, setOpen] = useState(false);
  const [oldPath, setOldPath] = useState("");

  useEffect(() => openDialog && handleOpen(), []);

  const handleOpen = () => {
    let oldPath = window.location.pathname;
    const newPath = `/users/${userHandle}/scream/${screamId}`;
    if (oldPath === newPath) oldPath = `/users/${userHandle}`;
    window.history.pushState(null, null, newPath);
    setOpen(true);
    setOldPath(oldPath);
    getScream(screamId);
  };

  const handleClose = () => {
    if (UI.loading) return;
    window.history.pushState(null, null, oldPath);
    setOpen(false);
    clearErrors();
  };

  const dialogMarkup = UI.loading ? (
    <div className={classes.spinnerDiv}>
      <CircularProgress size={200} thickness={2} />
    </div>
  ) : (
    <Grid container spacing={2}>
      {scream.sharedFromHandle && (
        <Typography variant="body2" className={classes.shareInfo}>
          <Typography
            variant="body2"
            component={Link}
            to={`/users/${scream.userHandle}/scream/${scream.sharedScreamId}`}
          >
            Scream
          </Typography>{" "}
          shared by{" "}
          <Typography
            variant="body2"
            component={Link}
            to={`/users/${scream.userHandle}`}
          >
            {scream.userNickname}
          </Typography>
        </Typography>
      )}
      <Grid item sm={5}>
        <img
          src={scream.userImage}
          alt="Profile"
          className={classes.profileImage}
        />
      </Grid>
      <Grid item sm={7}>
        <Typography
          component={Link}
          color="primary"
          variant="h5"
          to={`/users/${
            scream.sharedFromHandle
              ? scream.sharedFromHandle
              : scream.userHandle
          }`}
        >
          {scream.sharedFromHandle
            ? scream.sharedFromNickname
            : scream.userNickname}
        </Typography>
        <hr className={classes.invisibleSeparator} />
        <Typography variant="body2" color="textSecondary">
          {dayjs(scream.createdAt).format("h:mm a, MMMM DD YYYY")}
        </Typography>
        <hr className={classes.invisibleSeparator} />
        {scream.repliedScreamId && (
          <div className={classes.replyContent}>
            <Typography variant="body2">
              <Typography
                variant="body2"
                component={Link}
                to={`/users/${scream.replyToHandle}`}
              >
                {scream.replyToNickname}
              </Typography>{" "}
              <Typography
                variant="body2"
                component={Link}
                to={`/users/${scream.replyToHandle}/scream/${scream.repliedScreamId}`}
              >
                screamed:
              </Typography>{" "}
            </Typography>
            <Typography variant="body2">{scream.repliedScreamBody}</Typography>
          </div>
        )}
        <Typography variant="body1">{scream.body}</Typography>
        {scream.imageUrl && <img src={scream.imageUrl} alt="Scream image" />}
        <LikeButton screamId={screamId} />
        <span>{scream.likeCount}</span>
        <MyButton tip="comments">
          <ChatIcon color="primary" />
        </MyButton>
        <span>{scream.commentCount}</span>
        <ShareButton screamData={scream} />
        <span>{scream.shares && scream.shares.length}</span>
      </Grid>
      <hr className={classes.visibleSeparator} />
      <CommentForm screamId={screamId} />
      <Comments comments={scream.comments} />
    </Grid>
  );

  return (
    <>
      <MyButton
        onClick={handleOpen}
        tip="Expand scream"
        tipClassName={classes.expandButton}
      >
        <UnfoldMore color="primary" />
      </MyButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        {!UI.loading && (
          <MyButton
            tip="Close"
            onClick={handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
        )}
        <DialogContent className={classes.dialogContent}>
          {dialogMarkup}
        </DialogContent>
      </Dialog>
    </>
  );
}

ScreamDialog.propTypes = {
  clearErrors: PropTypes.func.isRequired,
  getScream: PropTypes.func.isRequired,
  screamId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  scream: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  openDialog: PropTypes.bool,
  classes: PropTypes.object.isRequired,
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
