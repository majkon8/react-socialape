import React, { useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";
import DeleteScream from "./DeleteScream";
import ScreamDialog from "./ScreamDialog";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import PostScream from "./PostScream";
// MUI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import Tooltip from "@material-ui/core/Tooltip";
// Icons
import ChatIcon from "@material-ui/icons/Chat";
// Redux
import { connect } from "react-redux";

const styles = (theme) => ({
  ...theme.spreadThis,
  card: {
    display: "flex",
    position: "relative",
    marginBottom: 20,
    alignItems: "center",
  },
  image: { minWidth: 200, height: 200 },
  content: { padding: 25, objectFit: "cover" },
});

function Scream({ scream, user, classes, openDialog }) {
  const [fullImage, setFullImage] = useState(false);

  const handleClose = () => setFullImage(false);

  const handleOpen = () => setFullImage(true);

  dayjs.extend(relativeTime);

  const deleteButton =
    user.authenticated && scream.userHandle === user.credentials.handle ? (
      <DeleteScream screamId={scream.screamId} />
    ) : null;

  return (
    <Card className={classes.card}>
      <CardMedia
        image={scream.userImage}
        title="Profile image"
        className={classes.image}
      />
      <CardContent className={classes.content}>
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
        <Typography
          variant="h5"
          component={Link}
          to={`/users/${
            scream.sharedFromHandle
              ? scream.sharedFromHandle
              : scream.userHandle
          }`}
          color="primary"
        >
          {scream.sharedFromHandle
            ? scream.sharedFromNickname
            : scream.userNickname}
        </Typography>
        {deleteButton}
        <Typography variant="body2" color="textSecondary">
          {dayjs(scream.createdAt).fromNow()}
        </Typography>
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
        {scream.imageUrl && (
          <>
            <Tooltip title="Open full size">
              <img
                onClick={handleOpen}
                className={classes.imgPreview}
                src={scream.imageUrl}
                alt="Scream image"
              />
            </Tooltip>
            <Dialog open={fullImage} onClose={handleClose}>
              <img
                style={{ width: "100%", height: "auto" }}
                src={scream.imageUrl}
                alt="Scream image"
              />
            </Dialog>
          </>
        )}
        <div style={{ marginTop: 5 }}>
          {scream.tags.map((tag) => (
            <Typography
              variant="body2"
              component={Link}
              to={`/screams/search/${tag}`}
              key={tag}
              style={{ display: "inline", color: "#00bcd4" }}
            >
              {`#${tag} `}
            </Typography>
          ))}
        </div>
        <LikeButton screamId={scream.screamId} />
        <span style={{ marginRight: 5 }}>{scream.likeCount}</span>
        <MyButton tip="Comments">
          <ChatIcon color="primary" />
        </MyButton>
        <span>{scream.commentCount}</span>
        <ShareButton screamData={scream} />
        <span>{scream.shares.length}</span>
        {!scream.sharedScreamId && (
          <>
            <PostScream replyScreamData={scream} />
            <span>{scream.replies.length}</span>
          </>
        )}
        <ScreamDialog
          screamId={scream.screamId}
          userHandle={scream.userHandle}
          openDialog={openDialog}
        />
      </CardContent>
    </Card>
  );
}

Scream.propTypes = {
  user: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool,
};

const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps)(withStyles(styles)(Scream));
