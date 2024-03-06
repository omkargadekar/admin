const getTimeDifference = (createdAt) => {
  if (!createdAt){
    console.log("no valid date" ,createdAt)};
    const currentTime = new Date();
    const messageTime = new Date(createdAt);
    const differenceInSeconds = Math.floor((currentTime - messageTime) / 1000);
  
    if (differenceInSeconds < 60) {
      return `${differenceInSeconds} seconds ago`;
    } else if (differenceInSeconds < 3600) {
      return `${Math.floor(differenceInSeconds / 60)} minutes ago`;
    } else if (differenceInSeconds < 86400) {
      return `${Math.floor(differenceInSeconds / 3600)} hours ago`;
    } else {
      return `${Math.floor(differenceInSeconds / 86400)} days ago`;
    }
  };
  
  export default getTimeDifference;