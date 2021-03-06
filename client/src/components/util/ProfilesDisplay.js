import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import StaticProfile from "../profile/StaticProfile";
import ProfileSkeleton from "./ProfileSkeleton";
import Masonry from "react-masonry-css";
// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({ ...theme.spreadThis });

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  800: 2,
  550: 1,
};

function ProfilesDisplay({ users, loading, classes }) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return;
    setCurrentPage(currentPage + 1);
  };

  const profilesMarkup =
    !loading && users && users.length === 0 ? (
      <Typography variant="h5" className={classes.noData}>
        No users found
      </Typography>
    ) : (
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {loading
          ? Array.from({ length: 12 }).map((item, index) => (
              <ProfileSkeleton key={index} />
            ))
          : users &&
            users.map((user, index) => {
              if (index < currentPage * 24)
                return <StaticProfile profile={user} key={user.handle} />;
              return null;
            })}
      </Masonry>
    );
  return profilesMarkup;
}

ProfilesDisplay.propTypes = {
  classes: PropTypes.object.isRequired,
  users: PropTypes.array,
  loading: PropTypes.bool.isRequired,
};

export default withStyles(styles)(ProfilesDisplay);
