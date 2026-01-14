import { FC } from "react";
import { Link } from "react-router-dom";

interface BreadCrumbProps {
  data: Array<{
    name: string;
    path: string;
    state?: any;
  }>;
}

export const BreadCrumb: FC<BreadCrumbProps> = ({ data }) => {
  return (
    <div className="breadcrumb-navi">
      <ul>
        {data.map((item, index) => {
          return (
            <li
              key={`${item.name}_index`}
              className={index === data.length - 1 ? "active" : ""}
            >
              <Link to={item.path} state={item?.state}>
                {item.name}{" "}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
