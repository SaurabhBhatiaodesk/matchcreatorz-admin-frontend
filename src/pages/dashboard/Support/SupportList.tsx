import "./SupportCss.css";
import { ROUTE_PATHS } from "../../../routes/routePaths";
import { BreadCrumb } from "../../../components";
import { useEffect, useRef, useState } from "react";
import UsersList from "./UsersList";
import { useAuthStore } from "../../../store/auth/authStore";
import { useSocket } from "../../../context/SocketContext";
import { Config } from "../../../config/AppConfig";
import { DefaultUser, DefaultDoc } from "../../../constant";

const SupportList = () => {
  const ADMIN_USERS_LIST = "getUserList";
  const ADMIN_CHAT_HISTORY = "supportHistory";
  const MESSAGE_LISTNER = "new-support";
  const SEND_MESSAGE_KEY = "sendSupport";
  const [userMessage, setUserMessage] = useState("");
  const { socket, connected } = useSocket();
  const [selectedUserType, setSelectedUserType] = useState("BUYER");
  const [messages, setMessages] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const auth = useAuthStore();
  const [page, setPage] = useState(1);
  const [usersList, setUsersList] = useState([]);
  const [senderInfo, setSenderInfo] = useState<any>("");

  useEffect(() => {
    if (socket && connected) {
      getUsersList("BUYER");

      socket
        .off(MESSAGE_LISTNER, listenNewMessage)
        .on(MESSAGE_LISTNER, listenNewMessage);
    } else {
      socket && socket.off(MESSAGE_LISTNER, listenNewMessage);
    }

    return () => {
      socket && socket.off(MESSAGE_LISTNER, listenNewMessage);
    };
  }, [senderInfo]);

  useEffect(() => {
    getUsersList(selectedUserType);
  }, [selectedUserType]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const listenNewMessage = (result: any) => {
    getUsersList(selectedUserType);

    if(senderInfo?.userId === result?.userId &&  result?.receiverType === "ADMIN"){
      setMessages((prevMessages) => [...prevMessages , result]);
      scrollToBottom();
    }else{
      setMessages((prevMessages) => [...prevMessages]);
      scrollToBottom();
    }
  };

  const getUsersList = (sendBy: any) => {
    const bodyData = {
      token: auth.token,
      userType: "ADMIN",
      type: sendBy,
      page: 1,
      limit: 10,
    };
    socket.emit(ADMIN_USERS_LIST, bodyData, (acknowledgmentData: any) => {
      const { success, data } = acknowledgmentData;
      if (success) {
        setUsersList(data?.records);
      }
    });
  };
  const getSupportHistory = (user: any) => {
    setSenderInfo(user);
    const bodyData = {
      senderId: user?.userId,
      token: auth.token,
      userType: "ADMIN",
      page,
      limit: 20,
    };
    socket.emit(ADMIN_CHAT_HISTORY, bodyData, (acknowledgmentData: any) => {
      const { success, data } = acknowledgmentData;
      if (success) {
        setMessages(data?.messages.reverse());
        getUsersList(selectedUserType);
      }
    });
  };
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    return `${hours % 12 || 12}:${minutes} ${ampm}`;
  };
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
    }
  };
  const sendMessage = () => {
    if (socket && userMessage.trim() != "") {
      const body = {
        token: auth.token,
        messageType: "TEXT",
        messageValue: userMessage,
        messageTo: senderInfo?.userId,
        userType: "ADMIN",
      };
      setUserMessage("");
      socket.emit(SEND_MESSAGE_KEY, body, (acknowledgmentData: any) => {
        const { data } = acknowledgmentData;

        setMessages((prevMessages) => [...prevMessages, data]);
        scrollToBottom();
      });
    }
  };
  return (
    <section id="main-content">
      <div className="wrapper">
        <div className="deshtitle-sec mb-3">
          <div className="row">
            <div className="col-md-12">
              <div className="dash-title">Support Manager</div>
              <BreadCrumb
                data={[
                  { name: "Dashboard", path: ROUTE_PATHS.DASHBOARD },
                  { name: "Support", path: ROUTE_PATHS.SUPPORT_LIST },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="chat-area border">
          {/* chat list */}
          <div className="chatlist">
            <div className="modal-dialog-scrollable">
              <div className="modal-content">
                <div className="chat-header">
                  <ul className="nav nav-tabs" id="myTabContent" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        onClick={() => setSelectedUserType("BUYER")}
                        className={`nav-link ${
                          selectedUserType === "BUYER" && "active"
                        }`}
                        id="Buyer-tab"
                        type="button"
                      >
                        Buyer
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        onClick={() => setSelectedUserType("SELLER")}
                        className={`nav-link ${
                          selectedUserType === "SELLER" && "active"
                        }`}
                        type="button"
                      >
                        Seller
                      </button>
                    </li>
                  </ul>
                </div>
                <UsersList
                  data={usersList}
                  onClick={(item: any) => getSupportHistory(item)}
                  senderInfo={senderInfo}
                />
              </div>
            </div>
          </div>
          {/* chat list end*/}
          <div className="chatbox">
            <div className="modal-dialog-scrollable">
              <div className="modal-content">
                <div className="msg-head">
                  <div className="row">
                    <div className="col-md-8">
                      {senderInfo ? (
                        <>
                          <div className="d-flex align-items-center">
                            <span className="chat-icon">
                              <img
                                className="img-fluid"
                                src={
                                  senderInfo?.user?.avatar
                                    ? Config.mediaUrl(senderInfo?.user?.avatar)
                                    : DefaultUser
                                }
                                alt="image title"
                              />
                            </span>
                            <div className="flex-shrink-0">
                              <img
                                className="img-fluid"
                                src={
                                  senderInfo?.user?.avatar
                                    ? Config.mediaUrl(senderInfo?.user?.avatar)
                                    : DefaultUser
                                }
                                alt="user img"
                              />
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h3>
                                {senderInfo?.user?.fullName ?? "New User"}
                              </h3>
                            </div>
                          </div>
                        </>
                      ) : (
                        <h3>Select a user to chat with</h3>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className="modal-body"
                  ref={chatEndRef}
                  style={{ height: "700px", overflowY: "scroll" }}
                >
                  {senderInfo && (
                    <div className="msg-body">
                      <ul>
                        {messages.map((a: any, index: any) => (
                          <li
                            key={index}
                            className={
                              a.senderType === "BUYER" ||
                              a.senderType === "SELLER"
                                ? "sender"
                                : "repaly"
                            }
                          >
                            {a?.messageType === "IMAGE" ? (
                            <a
                              href={a?.message ? Config.mediaUrl(a?.message) : DefaultUser}
                              target="_blank" // Opens the link in a new tab
                              rel="noopener noreferrer" // Improves security when using target="_blank"
                            >
                              <img
                                src={a?.message ? Config.mediaUrl(a?.message) : DefaultUser}
                                alt="image title"
                                style={{
                                  width: "250px",
                                  height: "auto",
                                  maxWidth: "80%",
                                  borderRadius: "8px",
                                }}
                              />
                            </a>
                              ) : a?.messageType === "DOCUMENT" ? (
                                <a
                                href={a?.message ? Config.mediaUrl(a?.message) : "#"}
                                target="_blank" // Opens the link in a new tab
                                rel="noopener noreferrer" // Improves security when using target="_blank"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  color: a?.message ? "blue" : "gray", // Blue for links, gray for no document
                                  textDecoration: "none",
                                  fontSize: "14px",
                                  gap: "8px", // Adds spacing between the icon and text
                                }}
                              >
                                <img
                                  src={DefaultDoc} // Assuming DefaultDoc is an image URL
                                  alt="Document Icon"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                  }}
                                />
                                {a?.message ? "View Document" : "No Document Available"}
                              </a>
                              
                              ) : (
                                <p>{a?.message}</p>
                              )}



                            <span className="time">
                              {a?.created && formatTime(a?.created)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {senderInfo && (
                  <div className="send-box">
                    <div className="d-flex align-items-center">
                      {/* Message input and send button */}
                      <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Write a message..."
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                      />
                      <button
                        className="btn btn-primary py-2"
                        onClick={sendMessage}
                      >
                        <i className="fa fa-paper-plane" aria-hidden="true"></i>{" "}
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportList;
