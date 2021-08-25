const handleFirebaseError = (error) => {
  let message 
  switch (error.code){
    case "auth/weak-password":
      message = "Password should be 6 characters or more!";
      break;
    case "auth/email-already-in-use":
      message = "Nickname taken!";
      break;
    case "auth/wrong-password":
      message = "Wrong password!";
      break;
    case "auth/user-not-found":
      message = "User do not exist";
      break;
    default:
      message = "Uncharted error";
  };

  return message;
};

export default handleFirebaseError;