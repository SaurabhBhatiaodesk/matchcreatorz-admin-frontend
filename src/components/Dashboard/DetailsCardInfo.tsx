import { FC } from "react";
import { Link } from "react-router-dom";

interface DetailsCardInfoInterface {
  title: string;
  cardIcon: string;
  backgroundColor: string;
  titleColor: string;
  value: string;
  navigate?: string;
}

export const DetailsCardInfo: FC<DetailsCardInfoInterface> = ({
  title,
  cardIcon,
  backgroundColor,
  titleColor,
  value,
  navigate,
}) => {
  return (
    <div className="salescell">
      <div
        className="salescell-inner shadow"
        style={{ background: `${backgroundColor}` }}
      >
        <div className="salesbox">
          <Link to={navigate || ""} className="border-0">
            <div className="img-icon">
              <img alt="" src={cardIcon} />
            </div>
            <h5>{title}</h5>
          </Link>
          <div className="cell-total" style={{ background: `${titleColor}` }}>
            <span className="text-center">{value}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

