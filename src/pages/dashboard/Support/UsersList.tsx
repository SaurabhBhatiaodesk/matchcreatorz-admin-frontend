import { Config } from "../../../config/AppConfig";
import "./SupportCss.css";
import { DefaultUser } from "../../../constant";
const UsersList = ({ data, onClick, senderInfo }: any) => {


  return (
    <div className="modal-body">
      <div className="chat-lists">
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="Buyer"
            role="tabpanel"
            aria-labelledby="Buyer-tab"
          >
            {data.map((item: any, index: any) => (
              <div
                className="chat-list"
                onClick={() => onClick(item)}
                key={index}
              >
                <a href="#" className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="img rounded-circle"
                      src={
                        item?.user?.avatar
                          ? Config.mediaUrl(item?.user?.avatar)
                          : DefaultUser
                      }
                      width={45}
                      height={45}
                      alt={item?.user?.fullName?.split(" ")?.[0] ?? 'User'}
                    />
                    <span className="active"></span>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h3>{item?.user?.fullName?.split(" ")?.[0] ?? 'User'}</h3>
                    <p>{item.designation}</p>
                    <p>
                      {item?.messageType === 'DOCUMENT'
                        ? 'New Document'
                        : item?.messageType === 'IMAGE'
                        ? 'New Image'
                        : item.latestMessage?.substring(0, 20) + "..."}
                      
                      {item?.unreadCount > 0 && (
                        <span className="badge badge-dark float-right">
                          {senderInfo.userId === item.user?.id ? '' : item?.unreadCount}
                        </span>
                      )}
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
