export default {
  palette: {
    primary: {
      light: "#df6843",
      main: "#d84315",
      dark: "#972e0e",
      contrastText: "#fff"
    },
    secondary: {
      light: "#33c9dc",
      main: "#00bcd4",
      dark: "#008394",
      contrastText: "#fff"
    }
  },
  typography: { useNextVariants: true },
  spreadThis: {
    noData: { textAlign: "center", color: "rgba(0, 0, 0, 0.6)" },
    form: { textAlign: "center" },
    image: { margin: "10px auto" },
    pageTitle: { margin: "10px auto" },
    textField: { margin: "10px auto" },
    button: { marginTop: 20, position: "relative" },
    customError: { color: "red", fontSize: "0.8rem", marginTop: 10 },
    progress: { position: "absolute" },
    paper: { padding: 20 },
    profile: {
      "& .image-wrapper": {
        textAlign: "center",
        position: "relative",
        "& button": { position: "absolute", top: "80%", left: "70%" }
      },
      "& .profile-image": {
        width: 200,
        height: 200,
        objectFit: "cover",
        maxWidth: "100%",
        borderRadius: "50%"
      },
      "& .follow-number": { color: "#d84315", fontWeight: "bold" },
      "& .profile-handle": { textAlign: "center" },
      "& .profile-details": {
        textAlign: "center",
        "& span, svg": { verticalAlign: "middle" },
        "& a": { color: "#00bcd4" }
      },
      "& hr": { border: "none", margin: "0 0 10px 0" },
      "& svg.button": { "& hover": { cursor: "pointer" } }
    },
    buttons: { textAlign: "center", "& a": { margin: "20px 10px" } },
    invisibleSeparator: { border: "none", margin: 4 },
    visibleSeparator: {
      width: "100%",
      borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
      marginBottom: 20
    }
  }
};
