import React, { useState, useEffect } from "react";
import StaticProfile from "../components/profile/StaticProfile";
import ProfileSkeleton from "./ProfileSkeleton";
import Masonry from "react-masonry-css";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  800: 2,
  550: 1
};

const ProfilesDisplay = ({ users, loading }) => {
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

  const profilesMarkup = (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {loading
        ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(el => (
            <ProfileSkeleton key={el} />
          ))
        : users &&
          users.map((user, index) => {
            if (index < currentPage * 24)
              return <StaticProfile profile={user} key={user.handle} />;
          })}
    </Masonry>
  );
  return profilesMarkup;
};

export default ProfilesDisplay;
