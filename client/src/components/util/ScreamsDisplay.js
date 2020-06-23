import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ScreamSkeleton from "./ScreamSkeleton";
import Scream from "../scream/Scream";
// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({ ...theme.spreadThis });

function ScreamsDisplay({ loading, screams, classes, screamIdParam }) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop <
      document.documentElement.offsetHeight
    )
      return;
    setCurrentPage(currentPage + 1);
  };

  const screamsMarkup = !loading ? (
    screams && screams.length > 0 ? (
      screams.map((scream, index) => {
        if (index < currentPage * 10) {
          return !screamIdParam ? (
            <Scream key={scream.screamId} scream={scream} />
          ) : scream.screamId !== screamIdParam ? (
            <Scream key={scream.screamId} scream={scream} />
          ) : (
            <Scream key={scream.screamId} scream={scream} openDialog />
          );
        }
        return null;
      })
    ) : (
      <Typography variant="h5" className={classes.noData}>
        No screams found
      </Typography>
    )
  ) : (
    <ScreamSkeleton />
  );

  return screamsMarkup;
}

ScreamsDisplay.propTypes = {
  classes: PropTypes.object.isRequired,
  screams: PropTypes.array,
  loading: PropTypes.bool.isRequired,
};

export default withStyles(styles)(ScreamsDisplay);
