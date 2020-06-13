import React, { Component } from "react";
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

export class Scream extends Component {
  state = { fullImage: false };

  handleClose = () => this.setState({ fullImage: false });

  handleOpen = () => this.setState({ fullImage: true });

  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      scream,
      scream: {
        body,
        tags,
        createdAt,
        userImage,
        userHandle,
        screamId,
        likeCount,
        commentCount,
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
        replies,
      },
      user: {
        authenticated,
        credentials: { handle },
      },
    } = this.props;
    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeleteScream screamId={screamId} />
      ) : null;
    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          title="Profile image"
          className={classes.image}
        />
        <CardContent className={classes.content}>
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
          <Typography
            variant="h5"
            component={Link}
            to={`/users/${sharedFromHandle ? sharedFromHandle : userHandle}`}
            color="primary"
          >
            {sharedFromHandle ? sharedFromNickname : userNickname}
          </Typography>
          {deleteButton}
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
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
          {imageUrl && (
            <>
              <Tooltip title="Open full size">
                <img
                  onClick={this.handleOpen}
                  className={classes.imgPreview}
                  src={imageUrl}
                  alt="Scream image"
                />
              </Tooltip>
              <Dialog open={this.state.fullImage} onClose={this.handleClose}>
                <img
                  style={{ width: "100%", height: "auto" }}
                  src={imageUrl}
                  alt="Scream image"
                />
              </Dialog>
            </>
          )}
          <div style={{ marginTop: 5 }}>
            {tags.map((tag) => (
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
          <LikeButton screamId={screamId} />
          <span style={{ marginRight: 5 }}>{likeCount}</span>
          <MyButton tip="Comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount}</span>
          <ShareButton screamData={scream} />
          <span>{shares.length}</span>
          {!sharedScreamId && (
            <>
              <PostScream replyScreamData={scream} />
              <span>{replies.length}</span>
            </>
          )}
          <ScreamDialog
            screamId={screamId}
            userHandle={userHandle}
            openDialog={this.props.openDialog}
          />
        </CardContent>
      </Card>
    );
  }
}

Scream.propTypes = {
  user: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool,
};

const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps)(withStyles(styles)(Scream));
