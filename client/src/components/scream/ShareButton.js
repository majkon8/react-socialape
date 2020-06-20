import React from "react";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";
// Redux
import { connect } from "react-redux";
import { shareScream } from "../../redux/actions/dataActions";
// Icons
import ShareIcon from "@material-ui/icons/Share";

function ShareButton({ shareScream, screamData }) {
  const handleShareScream = () => shareScream(screamData);

  return (
    <MyButton tip="Share" onClick={handleShareScream}>
      <ShareIcon color="primary" />
    </MyButton>
  );
}

ShareButton.propTypes = {
  shareScream: PropTypes.func.isRequired,
  screamData: PropTypes.object.isRequired,
};

const mapActionsToProps = { shareScream };

export default connect(null, mapActionsToProps)(ShareButton);
