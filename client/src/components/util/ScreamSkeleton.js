import React from "react";
import NoImg from "../../images/no-image.png";
import PropTypes from "prop-types";
// MUI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = (theme) => ({
  card: { display: "flex", marginBottom: 20 },
  cardContent: { width: "100%", flexDirection: "column", padding: 25 },
  cover: {
    width: 70,
    height: 70,
    objectFit: "cover",
    borderRadius: 50,
    diplay: "inline-block",
  },
  handle: {
    width: 150,
    height: 18,
    backgroundColor: theme.palette.primary.main,
    marginBottom: 30,
    marginLeft: 10,
    display: "inline-block",
  },
  date: {
    height: 14,
    width: 120,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    marginBottom: 10,
    marginTop: 5,
  },
  fullLine: {
    height: 15,
    width: "90%",
    marginBottom: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  halfLine: {
    height: 15,
    width: "50%",
    marginBottom: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
});

function ScreamSkeleton({ classes }) {
  const content = Array.from({ length: 6 }).map((item, index) => (
    <Card className={classes.card} key={index}>
      <CardContent className={classes.cardContent}>
        <img className={classes.cover} src={NoImg} />
        <div className={classes.handle} />
        <div className={classes.date} />
        <div className={classes.fullLine} />
        <div className={classes.fullLine} />
        <div className={classes.halfLine} />
      </CardContent>
    </Card>
  ));

  return <>{content}</>;
}

ScreamSkeleton.propTypes = { classes: PropTypes.object.isRequired };

export default withStyles(styles)(ScreamSkeleton);
