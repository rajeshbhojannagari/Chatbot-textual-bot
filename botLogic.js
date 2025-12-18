// botLogic.js

export default function getBotReply(message) {
  const msg = message.toLowerCase();

  if (msg.includes("hello")) {
    return "Hello! How can I help you?";
  }

  if (msg.includes("time")) {
    return "Current time is " + new Date().toLocaleTimeString();
  }

  if (msg.includes("date")) {
    return "Today's date is " + new Date().toLocaleDateString();
  }

  if (msg.includes("bye")) {
    return "Goodbye! Have a nice day 😊";
  }

  return "Sorry, I did not understand that.";
}
