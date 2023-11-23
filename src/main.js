import { styles } from "./assets.js";
import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";

class RuralBotWidget {
    widgetContainer = null;
    shadowContainer = 3;

    constructor() {
        this.initialize();
        this.injectStyles();
        this.setupWidget();
    }

    initialize() {
        this.widgetContainer = document.createElement("div");
        this.shadowContainer = this.widgetContainer.attachShadow({ mode: "open" });
        this.createBotWidget();

        document.body.appendChild(this.widgetContainer);
    }

    createBotWidget() {
        const widgetHtml = document.createElement("div");
        widgetHtml.innerHTML = `
            <div id="main-container" class="main-container">
            <div class="chat-container">
                <div class="chat-header">
                <div class="profile-image"></div>
                <div class="profile-name">RuralBot</div>
                <div class="header-close-button">
                    <button id="close-button" class="close-button">
                    <i class="fa-solid fa-xmark fa-2xl"></i>
                    </button>
                </div>
                </div>

                <div id="message-container" class="message-container">
                <div id="ellipsis-animation" class="ellipsis-animation">
                    <span><i class="fa-solid fa-circle fa-xs"></i></span>
                    <span><i class="fa-solid fa-circle fa-xs"></i></span>
                    <span><i class="fa-solid fa-circle fa-xs"></i></span>
                </div>

                <!-- Add more messages here -->
                </div>

                <div class="input-container">
                <input
                    id="input-field"
                    type="text"
                    class="input-field"
                    placeholder="Escribe tu consulta"
                    maxlength="144" />
                <button id="send-button" class="send-button">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
                <button id="record-button" class="record-button">
                    <i class="fa-solid fa-microphone"></i>
                </button>
                </div>
            </div>

            <!-- <div class="video-container">
                    <video id="video-source" class="video-portrait" autoplay>
                        <source src="" type="video/mp4"/>
                    </video>
                </div> -->
            </div>

            <div class="chatbot-button-container">
            <div class="btn-holder">
                <button id="chatbot-button" class="chatbot-button">
                <i class="fa-solid fa-robot"></i>
                </button>
            </div>
            </div>
        `;

        this.shadowContainer.appendChild(widgetHtml);
    }

    injectStyles() {
        const styleTag = document.createElement("style");
        styleTag.innerHTML = styles.replace(/^\s+|\n/gm, "");
        this.shadowContainer.appendChild(styleTag);

        // fontAwesome should be added to main DOM
        const fontAwesomeLink = document.createElement("link");
        fontAwesomeLink.rel = "stylesheet";
        fontAwesomeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";
        document.head.appendChild(fontAwesomeLink);

        const googleFont = document.createElement("link");
        googleFont.rel = "stylesheet";
        googleFont.href = "https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400&display=swap";
        document.head.appendChild(googleFont);
    }

    setupWidget() {
        const sendButton = this.shadowContainer.querySelector("#send-button");
        const inputField = this.shadowContainer.querySelector("#input-field");
        const recordButton = this.shadowContainer.querySelector("#record-button");
        const videoField = this.shadowContainer.querySelector("#video-source");
        const chatbotButton = this.shadowContainer.querySelector("#chatbot-button");
        const closeButton = this.shadowContainer.querySelector("#close-button");
        const ellipsis = this.shadowContainer.querySelector("#ellipsis-animation");
        ellipsis.style.display = "none";

        // EVENTS
        chatbotButton.addEventListener("click", () => {
            const mainContainer = this.shadowContainer.querySelector("#main-container");
            if (mainContainer.style.display == "flex") {
                mainContainer.style.display = "none";
                return;
            }

            mainContainer.style.display = "flex";
        });

        closeButton.addEventListener("click", () => {
            const mainContainer = this.shadowContainer.querySelector("#main-container");
            mainContainer.style.display = "none";
        });

        sendButton.addEventListener("click", () => {
            if (inputField.value) {
                sendClientMessage(inputField.value);
                addUserMessage(inputField.value);
            }

            inputField.value = "";
        });

        inputField.addEventListener("keyup", (event) => {
            if (event.code == "Enter") {
                if (inputField.value) {
                sendClientMessage(inputField.value);
                addUserMessage(inputField.value);
                }

                inputField.value = "";
            }
        });

        let isRecording = false;
        recordButton.addEventListener("click", () => {
            console.log(isRecording);
        });

        // FUNCTIONS
        const onRecordSuccess = (stream) => {
            const mediaRecorder = new MediaRecorder(stream);
            let chunks = [];

            recordButton.onclick = function () {
                if (isRecording) {
                    mediaRecorder.stop();
                    recordButton.classList.remove("recording-button");
                    isRecording = false;
                } else {
                    mediaRecorder.start();
                    recordButton.classList.add("recording-button");
                    isRecording = true;
                }
            }

            mediaRecorder.onstop = function (e) {
                const blob = new Blob(chunks, { "type": "audio/webm" });
                chunks = [];
                socket.emit("client_send_audio", blob);
                // showEllipsis(true);
                console.log("Sending record data" + chunks);
            }

            mediaRecorder.ondataavailable = function (e) {
                chunks.push(e.data);
            }
        }

        const onRecordError = (err) => {
            console.log("The following error occurred: " + err);
        }

        // Media Recording
        if (navigator.mediaDevices.getUserMedia) {
            console.log("getUSerMedia is supported.");
            const constrains = { audio: true };

            navigator.mediaDevices.getUserMedia(constrains).then(onRecordSuccess, onRecordError);
        } else {
            console.log("getUserMedia is not supported.");
            
            recordButton.style.display = "none";
        }

        const sendClientMessage = (message) => {
            const data = JSON.parse(`{"message" : "${message}"}`);

            if (!data) return;

            socket.emit("client_sent_message_event", data);
        }

        // Add user message chat entry
        const addUserMessage = (message) => {
            addMessageToChat(message, "bubblesender");
            // addWaitingMessage();
        }

        // Add system message chat entry
        var systemMessageBox = null;
        const addSystemMessage = (message, status) => {
            const container = this.shadowContainer.querySelector("#message-container");

            if (status == "start") {  
                const divEl = document.createElement("div");
                systemMessageBox = document.createElement("span");
                addWaitingMessage(systemMessageBox);
                divEl.classList.add("speechbubble");
                divEl.classList.add("bubblereceiver");
                divEl.appendChild(systemMessageBox);
                container.appendChild(divEl);
            } else if (status == "progress") {
                systemMessageBox.textContent = systemMessageBox.textContent + message;
                removeWaitingMessage(systemMessageBox);
            } else if (status == "finish") {
                message = systemMessageBox.textContent;
                const urls = systemMessageBox.textContent.match(/\b((https?|ftp|file):\/\/|(www|ftp)\.)[-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/ig);
                
                if (urls) {
                    message = replaceSimpleLinkOnMessage(message, Object.values(urls));
                }

                message = replaceNewLineOnMessage(message);
                
                const parser = new DOMParser();
                const span_message =  attachSpanTagOnMessage(message);
                const spanEl = parser.parseFromString(span_message, "text/html");

                systemMessageBox.innerHTML = "";
                systemMessageBox.appendChild(spanEl.body.firstElementChild);
            }

            container.scrollTop = container.scrollHeight;
        }

        const addMessageToChat = (message, sender) => {
            const parser = new DOMParser();
            const container = this.shadowContainer.querySelector("#message-container");
            const senderEl = document.createElement("div");

            const span_message = attachSpanTagOnMessage(message);
            const spanEl = parser.parseFromString(span_message, "text/html");

            senderEl.classList.add("speechbubble");
            senderEl.classList.add(sender);
            senderEl.appendChild(spanEl.body.firstElementChild);

            container.appendChild(senderEl);
            container.scrollTop = container.scrollHeight;
        }

        const addWaitingMessage = (parent) => {
            const ellipsisEl = ellipsis.cloneNode(true);
            ellipsisEl.style.display = "inline-block";

            parent.appendChild(ellipsisEl);
        }

        const removeWaitingMessage = (parent) => {
            const ellipsisEl = parent.querySelector(".ellipsis-animation:last-child");
            if (ellipsisEl) {
                ellipsisEl.remove();
            }
        }
        
        const createLinkTag = (url) => {
            return "<a href='" + url + "' target='_blank'>" + url + "</a>";
        }

        const createImageTag = (url) => {
            return "<a href='" + url + "' target='_blank'><img src='" + url + "'></a>d";
        }

        const createVideoTag = (url) => {
            return "<video controls><source src='" + url + "' type='video/mp4'></video>";
        }

        const replaceLinksOnMessage = (message, urls) => {
            if (urls.length == 0) {
                return message;
            }

            for (let item of urls) {
                let linkTag = item.content;

                if (item.type == "link") {
                linkTag = createLinkTag(item.content);
                } else if (item.type == "image") {
                linkTag = createImageTag(item.content);
                } else if (item.type == "video") {
                linkTag = createVideoTag(item.content);
                }
                
                message = message.replace(item.content, linkTag);
            }

            return message;
        }

        const replaceSimpleLinkOnMessage = (message, urls) => {
            for (let link of urls) {
                const linkTag = createLinkTag(link);
                message = message.replace(link, linkTag);
            }

            return message;
        }

        const hasInitialTag = (message, tag) => {
            return (message.indexOf(tag) == 0);
        }

        const replaceNewLineOnMessage = (message) => {
            const newLineChr = "\n";
            const newLineHtml = "<br>"

            message = message.replaceAll(newLineChr, newLineHtml);

            while (hasInitialTag(message, newLineHtml)) {
                message = message.replace(newLineHtml, "").trim();
            }
            
            return message;
        }

        const attachSpanTagOnMessage = (message) => {
            return "<span>" + message + "</span>";
        }

        // EVENT SOCKETS
        var socket = io("https://ruralbotapp.westeurope.azurecontainer.io", {
            transports: ["websocket"]
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
            socket.disconnect();
        });

        socket.on("connection_client_stablished_event_response", (msg) => {
            console.log(msg);
        });

        // socket.on("system_sent_message_event", function (data) {
        //   console.log("system_sent_message_event...");
        //   const response = JSON.parse(data);

        //   parsed_message = replaceLinksOnMessage(response.message, response.urls);
        //   parsed_message = replaceNewLineOnMessage(parsed_message);
        //   addSystemMessage(parsed_message);
        // });

        let tmp_message;
        socket.on("system_sent_stream_message_start_event", () => {
            addSystemMessage("", "start");
        });

        socket.on("system_sent_stream_message_progress_event", (data) => {
            addSystemMessage(data, "progress");
        });

        socket.on("system_sent_stream_message_finish_event", () => {
            addSystemMessage("", "finish");
        })

        socket.on("message_transcribed_event", (msg) => {
            addUserMessage(msg);
            // isImg(url[0])
            // msg.replace(url[0], "<img src=url[0]...")
        });

        socket.on("system_video_created_event", function (data) {
            console.log(data);
            videoField.src = data;
        });

        socket.on("ping", () => {
            console.log("ping");
        });
    }

}

(() => new RuralBotWidget())();

