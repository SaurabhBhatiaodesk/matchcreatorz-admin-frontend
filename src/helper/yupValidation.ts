// useValidation.js

import * as yup from "yup";

const useValidation = () => {
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const emailRegxExp =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  const passwordRegxExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  // email validation
  const emailValidation = yup.object({
    email: yup
      .string()
      .required("Email is required.")
      .matches(emailRegxExp, "Please enter valid email.")
      .trim(),
  });

  // mobile number validation
  const mobileNumberValidation = yup.object({
    mobile_number: yup
      .string()
      .required("Mobile number required.")
      .matches(phoneRegExp, "Invalid mobile number.")
      .min(10, "Mobile number must be at least 10 characters.")
      .max(10, "Mobile number must be at most 10 characters.")
      .trim(),
  });

  // login validation
  const loginValidation = yup.object({
    email: yup
      .string()
      .required("Email is required.")
      .matches(emailRegxExp, "Please enter valid email.")
      .trim(),
    password: yup.string().required("Please enter password.").trim(),
  });

  // passwords validations
  const forgotPasswordValidation = yup.object({
    email: yup
      .string()
      .required("Email is required.")
      .matches(emailRegxExp, "Please enter valid email.")
      .trim(),
  });

  const resetPasswordValidation = yup.object({
    newPassword: yup
      .string()
      .required("New Password is required.")
      .matches(
        passwordRegxExp,
        "New Password must be at least 8 characters long and contains a combination of uppercase and lowercase letters, numbers and a special characters."
      )
      .min(8, "New password must be at least 8 characters long.")
      .max(15, "New password must be a maximum of 15 characters long.")
      .trim(),
    confirmPassword: yup
      .string()
      .required("Confirm New Password is required.")
      .oneOf(
        [yup.ref("newPassword")],
        "New Password and Confirm New Passwords must match."
      )
      .trim(),
  });

  const changePasswordValidation = yup.object({
    currentPassword: yup
      .string()
      .required("Current Password is required")
      .trim(),

    newPassword: yup
      .string()
      .required("New Password is required")
      .matches(
        passwordRegxExp,
        "New Password must be at least 8 characters long and contains a combination of uppercase and lowercase letters, numbers and a special characters."
      )
      .min(8, "New password must be at least 8 characters long.")
      .max(15, "New password must be a maximum of 15 characters long.")
      .trim(),

    confirmPassword: yup
      .string()
      .required("Confirm New Password is required.")
      .oneOf(
        [yup.ref("newPassword")],
        "New Password and Confirm New Passwords must match."
      )
      .trim(),
  });

  // profile validations
  const profileValidation = yup.object({
    firstName: yup.string().required("First name is required."),
    lastName: yup.string().required("Last name is required."),
  });

  // static content  validations
  const contentValidation = yup.object({
    description: yup.string().required("Description is required.").trim(),
  });

  // experience add/edit validations
  const experienceValidation = yup.object({
    experienceName: yup
      .string()
      .required("Experience is required.")
      .min(3, "Experience must be at least 3 or more characters long.")
      .trim(),
  });

  // country add/edit validations
  const countryalidation = yup.object({
    countryName: yup.string().required("Country Name is required.").trim(),
    countryCode: yup.string().required("Country Code is required.").trim(),
    icon: yup.string().trim(),
    nationality: yup
      .string()
      .required("Country Nationality is required.")
      .trim(),
  });

  // city add/edit validations
  const cityalidation = yup.object({
    cityName: yup.string().required("City Name is required.").trim(),
    countryName: yup.string().required("Country  is required.").trim(),
    countryId: yup.string().trim(),
    state: yup.string().required("State is required.").trim(),
    desktopImage: yup.string().trim(),
    mobileImage: yup.string().trim(),
  });

  // city add/edit validations
  const adminSettingValidation = yup.object({
    androidAppVersion: yup
      .string()
      .required("Andorid app version is required.")
      .trim(),
    androidForceUpdate: yup.boolean(),
    iosAppVersion: yup.string().required("IOS app version is required.").trim(),
    iosForceUpdate: yup.boolean(),
    websiteVersion: yup
      .string()
      .required("Website version is required.")
      .trim(),
    maintenanceMode: yup.boolean(),
    currencySymbol: yup
      .string()
      .required("Currency symbol is required.")
      .trim(),
    currency: yup.string().required("Currency is required.").trim(),
    palBookingAmount: yup.number().required("Pal booking amount is required."),
    palBookingPercentage: yup
      .number()
      .required("Admin Commission is required."),
    chatDays: yup.number().required("Chat days is required."),
    languages: yup.array(),
    ageRange: yup.array(),
    experienceYear: yup.array(),
  });

  // Define other validations...

  return {
    emailValidation,
    mobileNumberValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    changePasswordValidation,
    profileValidation,
    contentValidation,
    experienceValidation,
    countryalidation,
    cityalidation,
    adminSettingValidation,
    // Return other validations...
  };
};

export default useValidation;
