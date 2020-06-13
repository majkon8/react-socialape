import React, { Component } from "react";
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

export class Notifications extends Component {
  state = { anchorEl: null };

  handleOpen = (event) => this.setState({ anchorEl: event.target });

  handleClose = () => this.setState({ anchorEl: null });

  onMenuOpened = () => {
    let unreadNotificationsIds = this.props.notifications
      .filter((not) => !not.read)
      .map((not) => not.notificationId);
    this.props.markNotificationsRead(unreadNotificationsIds);
  };

  render() {
    const { notifications } = this.props;
    const { anchorEl } = this.state;
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
    let notificationsMarkup =
      notifications && notifications.length > 0 ? (
        notifications.map((not) => {
          let verb;
          let icon;
          const iconColor = not.read ? "primary" : "secondary";
          const time = dayjs(not.createdAt).fromNow();
          switch (not.type) {
            case "like":
              verb = "liked";
              icon = (
                <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
              );
              break;
            case "comment":
              verb = "commented on";
              icon = <ChatIcon color={iconColor} style={{ marginRight: 10 }} />;
              break;
            case "follow":
              verb = "followed";
              icon = (
                <PersonAddIcon color={iconColor} style={{ marginRight: 10 }} />
              );
              break;
            case "share":
              verb = "shared";
              icon = (
                <ShareIcon color={iconColor} style={{ marginRight: 10 }} />
              );
              break;
            case "reply":
              verb = "replied";
              icon = (
                <ReplyIcon color={iconColor} style={{ marginRight: 10 }} />
              );
            default:
              break;
          }
          return (
            <MenuItem key={not.createdAt} onClick={this.handleClose}>
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
        })
      ) : (
        <MenuItem onClick={this.handleClose}>
          You have no notifications yet
        </MenuItem>
      );
    return (
      <>
        <Tooltip placement="top" title="Notifications">
          <IconButton
            aria-owns={anchorEl ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
          >
            {notificationIcon}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          onExit={this.onMenuOpened}
        >
          {notificationsMarkup}
        </Menu>
      </>
    );
  }
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
