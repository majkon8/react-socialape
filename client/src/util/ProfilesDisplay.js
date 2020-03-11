import React from "react";
import StaticProfile from "../components/profile/StaticProfile";
import ProfileSkeleton from "./ProfileSkeleton";
// MUI
import Grid from "@material-ui/core/Grid";

const ProfilesDisplay = ({ users, loading }) => {
  const profilesMarkup = (
    <Grid container spacing={2}>
      {loading
        ? [1, 2, 3, 4, 5, 6, 7, 8].map(el => (
            <Grid item lg={3} sm={4} xs={12} key={el}>
              <ProfileSkeleton />
            </Grid>
          ))
        : users &&
          users.map(user => (
            <Grid item lg={3} sm={4} xs={12} key={user.handle}>
              <StaticProfile profile={user} hideInfo={true} />
            </Grid>
          ))}
    </Grid>
  );
  return profilesMarkup;
};

export default ProfilesDisplay;
