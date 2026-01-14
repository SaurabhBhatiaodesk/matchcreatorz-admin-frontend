interface EditTabsProps {
  isEdit: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void; // Update this type based on how you're using `setActiveTab`
}

const EditTabs: React.FC<EditTabsProps> = ({ isEdit, activeTab, setActiveTab }) => {
  return (
    <>
      {isEdit && (
        <>
          {/* <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "seller-other-details" ? "active" : ""
              }`}
              onClick={() => setActiveTab("seller-other-details")}
            >
              Other Details
            </button>
          </li> */}

          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "portfolio" ? "active" : ""
              }`}
              onClick={() => setActiveTab("portfolio")}
            >
              Add Portfolio
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "faq" ? "active" : ""}`}
              onClick={() => setActiveTab("faq")}
            >
              Add FAQ
            </button>
          </li>
        </>
      )}
    </>
  );
};

export default EditTabs;
