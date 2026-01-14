import { FC } from "react";

interface Error {
  error: string | undefined | any;
  touched: boolean | undefined;
  name: string | undefined | any | null;
}

export const ErrorMessage: FC<Error> = ({ error, touched, name }) => {
  if (touched) {
    return (
      <p
        style={{
          display: "flex",
          margin: "5px",
          color: "red",
        }}
      >
        {error}{name}
      </p>
    );
  } else {
    return <></>;
  }
};
