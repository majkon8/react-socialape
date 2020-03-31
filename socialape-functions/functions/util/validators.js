const isEmpty = string => {
  if (string.trim() === "") return true;
  return false;
};

const isEmail = email => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  return false;
};

const handleRegEx = /^[a-zA-Z0-9_.-]*$/;

exports.validateSignupData = data => {
  let errors = {};
  if (isEmpty(data.email.trim())) errors.email = "Must not be empty";
  else if (!isEmail(data.email)) errors.email = "Must be a valid email address";
  if (isEmpty(data.password)) errors.password = "Must not be empty";
  else if (data.password.length < 8) errors.password = "Minimum 8 characters";
  else if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords must match";
  if (isEmpty(data.handle.trim())) errors.handle = "Must not be empty";
  else if (data.handle.length < 3) errors.handle = "Minimum 3 characters";
  else if (!handleRegEx.test(data.handle))
    errors.handle = "Only letters, numbers and - . _ allowed";
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLoginData = data => {
  let errors = {};
  if (isEmpty(data.email)) errors.email = "Must not be empty";
  if (isEmpty(data.password)) errors.password = "Must not be empty";
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.reduceUserDetails = data => {
  let userDetails = {};
  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio.trim();
  if (!isEmpty(data.website.trim())) {
    if (data.website.trim().substring(0, 4) !== "http") {
      userDetails.website = `http://${data.website.trim()}`;
    } else userDetails.website = data.website;
  }
  if (!isEmpty(data.location.trim()))
    userDetails.location = data.location.trim();
  if (!isEmpty(data.nickname.trim()))
    userDetails.nickname = data.nickname.trim();
  return userDetails;
};
