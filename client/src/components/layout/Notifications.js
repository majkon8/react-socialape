import React, { useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
// MUI
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
// Icons
import NotificationsIcon from "@material-ui/icons/Notifications";
import ChatIcon from "@material-ui/icons/Chat";
import FavoriteIcon from "@material-ui/icons/Favorite";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ShareIcon from "@material-ui/icons/Share";
import ReplyIcon from "@material-ui/icons/Reply";
// Redux
import { connect } from "react-redux";
import { markNotificationsRead } from "../../redux/actions/userActions";

function Notifications({ notifications, markNotificationsRead }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => setAnchorEl(event.target);

  const handleClose = () => setAnchorEl(null);

  const onMenuOpened = () => {
    let unreadNotificationsIds = notifications
      .filter((not) => !not.read)
      .map((not) => not.notificationId);
    markNotificationsRead(unreadNotificationsIds);
  };

  dayjs.extend(relativeTime);

  let notificationIcon;

  if (notifications && notifications.length > 0) {
    const notificationsNum = notifications.filter((not) => not.read === false)
      .length;
    notificationsNum > 0
      ? (notificationIcon = (
          <Badge badgeContent={notificationsNum} max={999} color="secondary">
            <NotificationsIcon />
          </Badge>
        ))
      : (notificationIcon = <NotificationsIcon />);
  } else notificationIcon = <NotificationsIcon />;

  const makeNotification = (not) => {
    let verb;
    let icon;
    const iconColor = not.read ? "primary" : "secondary";
    const time = dayjs(not.createdAt).fromNow();
    switch (not.type) {
      case "like":
        verb = "liked";
        icon = <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />;
        break;
      case "comment":
        verb = "commented on";
        icon = <ChatIcon color={iconColor} style={{ marginRight: 10 }} />;
        break;
      case "follow":
        verb = "followed";
        icon = <PersonAddIcon color={iconColor} style={{ marginRight: 10 }} />;
        break;
      case "share":
        verb = "shared";
        icon = <ShareIcon color={iconColor} style={{ marginRight: 10 }} />;
        break;
      case "reply":
        verb = "replied";
        icon = <ReplyIcon color={iconColor} style={{ marginRight: 10 }} />;
        break;
      default:
        break;
    }
    return (
      <MenuItem key={not.createdAt} onClick={handleClose}>
        {icon}
        <Typography
          component={Link}
          variant="body1"
          to={
            not.type === "follow"
              ? `/users/${not.sender}`
              : not.type === "share" || not.type === "reply"
              ? `/users/${not.sender}/scream/${not.screamId}`
              : `/users/${not.recipient}/scream/${not.screamId}`
          }
        >
          {not.type === "follow"
            ? `${not.sender} ${verb} you ${time}`
            : `${not.sender} ${verb} your scream ${time}`}
        </Typography>
      </MenuItem>
    );
  };

  const notificationsMarkup =
    notifications && notifications.length > 0 ? (
      notifications.map((not) => makeNotification(not))
    ) : (
      <MenuItem onClick={handleClose}>You have no notifications yet</MenuItem>
    );

  return (
    <>
      <Tooltip placement="top" title="Notifications">
        <IconButton
          aria-owns={anchorEl ? "simple-menu" : undefined}
          aria-haspopup="true"
          onClick={handleOpen}
        >
          {notificationIcon}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onExit={onMenuOpened}
      >
        {notificationsMarkup}
      </Menu>
    </>
  );
}

Notifications.propTypes = {
  markNotificationsRead: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  notifications: state.user.notifications,
});

export default connect(mapStateToProps, { markNotificationsRead })(
  Notifications
);
