import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";
// Icons
import DeleteOutline from "@material-ui/icons/DeleteOutline";
// Redux
import { connect } from "react-redux";
import { deleteComment } from "../../redux/actions/dataActions";

const styles = {
  deleteButton: { position: "absolute", left: "100%", top: "-10%" },
};

function DeleteComment({ screamId, commentId, deleteComment, classes }) {
  const handleDeleteComment = () => deleteComment(screamId, commentId);

  return (
    <MyButton
      tip="Delete Scream"
      onClick={handleDeleteComment}
      btnClassName={classes.deleteButton}
    >
      <DeleteOutline color="primary" />
    </MyButton>
  );
}

DeleteComment.propTypes = {
  screamId: PropTypes.string.isRequired,
  commentId: PropTypes.string.isRequired,
  deleteComment: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default connect(null, { deleteComment })(
  withStyles(styles)(DeleteComment)
);
