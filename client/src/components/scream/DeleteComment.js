import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";
// Icons
import DeleteOutline from "@material-ui/icons/DeleteOutline";
// Redux
import { connect } from "react-redux";
import { deleteComment } from "../../redux/actions/dataActions";

const styles = {
  deleteButton: { position: "absolute", left: "100%", top: "-10%" }
};

export class DeleteComment extends Component {
  deleteComment = () =>
    this.props.deleteComment(this.props.screamId, this.props.commentId);

  render() {
    const { classes } = this.props;
    return (
      <MyButton
        tip="Delete Scream"
        onClick={this.deleteComment}
        btnClassName={classes.deleteButton}
      >
        <DeleteOutline color="primary" />
      </MyButton>
    );
  }
}

DeleteComment.propTypes = {
  user: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  commentId: PropTypes.string.isRequired,
  deleteComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps, { deleteComment })(
  withStyles(styles)(DeleteComment)
);
