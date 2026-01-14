import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FAQListComponent from "./FaqList";
import { useFAQAddEdit } from "../../../store/users/usersServices";

interface FaqAddProps {
  data: any | undefined; // Adjust the type based on your needs
}
const FaqAddPage: React.FC<FaqAddProps> = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const faqAddEdit = useFAQAddEdit();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    mode: "all",
  });

  const handleFaqSubmit = () => {
    faqAddEdit
      .mutateAsync({
        userId: state?.info?.id,
        question: getValues().question,
        answer: getValues().answer,
      })
      .then((res) => {
        const { success, message } = res;
        if (success) {
          toast.success(message);
          setTimeout(() => {
            navigate(0);
          }, 1500);
        } else {
          if (message) {
            toast.error(message);
          }
        }
      });
  };

  return (
    <>
      <form
        name="faqAddEdit"
        id="faqAddEdit"
        onSubmit={handleSubmit(handleFaqSubmit)}
      >
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="row align-items-center mb-3">
                <label
                  htmlFor="question"
                  className="col-sm-4 col-form-label fw-semibold"
                >
                  Question :-
                </label>
                <div className="col-sm-6">
                  <input
                    id="question"
                    type="text"
                    className="form-control bg-light border border-1 rounded-2"
                    {...register("question", {
                      required: "Question is required",
                    })}
                  />
                  {errors.zipcode && (
                    <p className="text-danger">{errors.zipcode.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row align-items-center mb-3">
                <label
                  htmlFor="answer"
                  className="col-sm-4 col-form-label fw-semibold"
                >
                  Answer :-
                </label>
                <div className="col-sm-6">
                  <input
                    id="answer"
                    type="text"
                    className="form-control bg-light border border-1 rounded-2"
                    {...register("answer", {
                      required: "Answer is required",
                    })}
                  />
                  {errors.zipcode && (
                    <p className="text-danger">{errors.zipcode.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col mt-4">
              <span
                className="submit-btn"
                style={{ display: "inline-block", float: "right" }}
              >
                <button type="submit" className="btn btn-info">
                  Submit
                </button>
              </span>
            </div>
          </div>
        </div>
      </form>
      <FAQListComponent id={state?.info?.id} />
    </>
  );
};

export default FaqAddPage;
