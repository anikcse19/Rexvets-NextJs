export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (time: string) => {
  // const [hours, minutes] = time.split(":");
  // const hour = parseInt(hours);
  // const ampm = hour >= 12 ? "PM" : "AM";
  // const displayHour = hour % 12 || 12;
  // return `${displayHour}:${minutes} ${ampm}`;

  return "";
};
