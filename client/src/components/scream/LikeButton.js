import React from "react";
import MyButton from "../util/MyButton";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// Icons
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
// Redux
import { connect } from "react-redux";
import { likeScream, unlikeScream } from "../../redux/actions/dataActions";

function LikeButton({ user, screamId, likeScream, unlikeScream }) {
  const screamIsLiked = () => {
    if (user.likes && user.likes.find((like) => like.screamId === screamId))
      return true;
    return false;
  };

  const handleLikeScream = () => likeScream(screamId);

  const handleUnlikeScream = () => unlikeScream(screamId);

  const likeButton = !user.authenticated ? (
    <Link to="/login">
      <MyButton tip="like">
        <FavoriteBorder color="primary" />
      </MyButton>
    </Link>
  ) : screamIsLiked() ? (
    <MyButton tip="Unlike" onClick={handleUnlikeScream}>
      <FavoriteIcon color="primary" />
    </MyButton>
  ) : (
    <MyButton tip="Like" onClick={handleLikeScream}>
      <FavoriteBorder color="primary" />
    </MyButton>
  );
  return likeButton;
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ user: state.user });

const mapActionsToProps = { likeScream, unlikeScream };

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
