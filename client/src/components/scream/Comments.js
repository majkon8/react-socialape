import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import DeleteComment from "./DeleteComment";
// MUI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
// Redux
import { connect } from "react-redux";

const styles = theme => ({
  ...theme.spreadThis,
  commentImage: {
    maxWidth: "100%",
    height: 100,
    objectFit: "cover",
    borderRadius: "50%"
  },
  commentData: { position: "relative", marginLeft: 20 }
});

export class Comments extends Component {
  render() {
    const {
      comments,
      classes,
      user: {
        authenticated,
        credentials: { handle }
      },
      data: { scream }
    } = this.props;
    return (
      <Grid container>
        {comments && comments.map((comment, index) => {
          const {
            commentId,
            body,
            createdAt,
            userImage,
            userHandle,
            userNickname
          } = comment;
          const deleteButton =
            authenticated && userHandle === handle ? (
              <DeleteComment screamId={scream.screamId} commentId={commentId} />
            ) : null;
          return (
            <Fragment key={createdAt}>
              <Grid item sm={12}>
                <Grid container>
                  <Grid item sm={2}>
                    <img
                      src={userImage}
                      alt="comment"
                      className={classes.commentImage}
                    />
                  </Grid>
                  <Grid item sm={9}>
                    <div className={classes.commentData}>
                      <Typography
                        variant="h5"
                        component={Link}
                        to={`/users/${userHandle}`}
                        color="primary"
                      >
                        {userNickname}
                      </Typography>
                      {deleteButton}
                      <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
                      </Typography>
                      <hr className={classes.invisibleSeparator} />
                      <Typography variant="body1">{body}</Typography>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              {index !== comments.length - 1 && (
                <hr className={classes.visibleSeparator} />
              )}
            </Fragment>
          );
        })}
      </Grid>
    );
  }
}

Comments.propTypes = {
  comments: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({ user: state.user, data: state.data });

export default connect(mapStateToProps)(withStyles(styles)(Comments));
