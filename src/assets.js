export const styles = `
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css");

.chatbot-button {
  position: absolute;
  right: 50px;
  bottom: 35px;
  background-color: rgba(18, 23, 44, 1);
  color: white;
  border: none;
  padding: 5px;
  font-size: 31px;
  height: 80px;
  width: 80px;
  box-shadow: 0 2px 4px rgba(136, 94, 254, 1);
  border-radius: 50%;
  cursor: pointer;
}

.chatbot-button:hover {
  color: rgba(18, 23, 44, 1);
  background-color: rgba(136, 94, 254, 1);
  background-position: -100% 100%;
  box-shadow: 0 2px 4px rgba(18, 23, 44, 1);
}

.main-container {
  display: flex; /* set to none after testing */
  position: absolute;
  right: 30px;
  bottom: 120px;
  /* margin: 50px auto; */
  /* background-color:teal; */
  /* justify-content: center; */
  font-family: "Roboto", sans-serif;
}

.chat-container {
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 600px;
  max-height: 600px;
  margin-right: 20px;
  /* margin: 50px auto; */
  /* background: rgba(255, 255, 255, 0.2); */
  background-image: linear-gradient(to right, #9796f0 10%, #fbc7d4 100%);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5.1px);
  /* padding: 20px; */
  -webkit-backdrop-filter: blur(5.1px);
}

/****** CHAT WINDOW HEADER ******/
.chat-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: black;
  background-color: rgba(255, 255, 255, 0.5);
  overflow: hidden;
  padding: 5px;
  border-radius: 16px 16px 0 0;
  min-height: 50px;
}

.profile-image {
  display: inline-block;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-image: url("https://github.com/davamix/rural-bot-widget/blob/main/src/logo_512.png?raw=true");
}

.profile-name {
  font-size: 2em;
  padding-left: 0.3em;
  font-weight: 600;
}

.header-close-button {
  margin-left: auto;
}

.close-button {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  border: 0;
  height: 40px;
  width: 40px;
  cursor: pointer;
}

/* CHAT WINDOW MESSAGES */

.speechbubble {
  /* background-color: rgba(38, 39, 43, 0.2); */
  background-color: rgba(255, 255, 255, 0.5);
  /* color: #9fa2a7; */
  color: black;
  /* font-size: 0.8em; */
  line-height: 1.75;
  padding: 15px 25px;
  margin-bottom: 30px;
  cursor: default;
}

.bubblereceiver {
  border-left: 10px solid;
  border-image: linear-gradient(to bottom, #885efe 10%, #5b49f5 100%) 1 100%;
  /* border-image: linear-gradient( to bottom, #ABDCFF 10%, #0396FF 100%) 1 100%; */
  text-align: left;
}

.bubblesender {
  border-right: 10px solid;
  border-image: linear-gradient(to bottom, #7bdcb5 10%, #4caf50 100%) 1 100%;
  text-align: right;
}

.message-container::-webkit-scrollbar {
  width: 12px;
}

.message-container::-webkit-scrollbar-track {
  /* background: #071120; */
  background-color: rgba(255, 255, 255, 0.5);
  /* border-radius: 16px; */
}
.message-container::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  /* border-radius: 16px; */
  border: 3px solid;
}
.message-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 10px;
}

/***** CHAT VIDEO WINDOW ****/
.video-container {
  display: flex;
  flex-direction: column-reverse;
  border-radius: 16px;
}
.video-portrait {
  /* border-radius: 16px; */
  border-style: solid;
  border-width: 10px;
  /* border-image: linear-gradient(to left, #00C853, #B2FF59); */
  border-color: #ffffff33;
}

/* .message {
  margin-bottom: 10px;
}

.message.sender {
  text-align: right;
}

.message.sender .text {
  background-color: #d2f7c7;
  color: #000;
  padding: 5px 10px;
  border-radius: 5px;
  display: inline-block;
}

.message.receiver .text {
  background-color: #ffffff;
  color: #333333;
  padding: 5px 10px;
  border-radius: 10px;
  display: inline-block;
} */

/**** CHAT INPUT ****/
.input-container {
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: auto;
  padding: 10px;
}

.input-field {
  flex: 1;
  border-style: solid;
  border-width: 2px;
  border-radius: 5px;
  border-color: #ccc;
  padding: 10px;
  font-size: 14px;
  margin-bottom: auto;
  transition: box-shadow 0.3s ease;
}

.input-field:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(91, 73, 245, 1);
}

.send-button,
.record-button {
  background-color: #4caf50;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 10px;
  margin-left: 5px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.record-button {
  background-color: #aaa;
}

.recording-button {
  background-color: #dc3545;
  animation-name: pulse;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.send-button:active {
  background-color: #3d8b40;
}

.record-button:active {
  background-color: #868686;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.3);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 5px rgba(220, 53, 69, 0.3);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
  }
}

/**** Ellipsis animation ****/
.ellipsis-animation span {
  /* color: rgba(136, 94, 254, 1); */
  opacity: 0;
  -webkit-animation: ellipsis-dot 1s infinite;
  animation: ellipsis-dot 1s infinite;
}

.ellipsis-animation span:nth-child(1) {
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}
.ellipsis-animation span:nth-child(2) {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}
.ellipsis-animation span:nth-child(3) {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

@-webkit-keyframes ellipsis-dot {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes ellipsis-dot {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}


`