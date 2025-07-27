import validator from "validator";

interface SignupBody {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  age?: number;
  gender?: "Male" | "Female" | "Others";
  photoUrl?: string;
  about?: string;
  skills?: string[]
}

interface ReuqestWithBody {
  body: SignupBody;
}

export const validateSignUp = (req: ReuqestWithBody) => {
  const { firstName, lastName, email, password, age, gender } = req.body;
  let regularExpression =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

  if (firstName && !firstName.trim().length) {
    throw new Error("First Name is required");
  } else if (email && !validator.isEmail(email)) {
    throw new Error("Please enter a valid Email Address");
  } else if (password && regularExpression.test(password) === false) {
    throw new Error(
      "Please enter a strong password between 6 - 16 characters!!",
    );
  } else if (
    gender &&
    !["male", "female", "others"].includes(gender?.toLowerCase() as string)
  ) {
    throw new Error("Please Enter a valid gender");
  }
};

export const validateEditProfile = (req: ReuqestWithBody) => {
  const ALLOWED_UPDATES = ["firstName", "lastName", "age", "email", "gender", "photoUrl", "about", "skills"]

  const { firstName, lastName, age, email, gender, photoUrl, about, skills } = req.body;


  // validations
  if (firstName && !firstName.trim().length) {
    throw new Error("First Name cannot be empty")
  } else if (lastName && !lastName.trim().length) {
    throw new Error("Last Name cannot be empty")
  } else if (email && !validator.isEmail(email)) {
    throw new Error("Please Enter a valid email")
  } else if (photoUrl && !validator.isURL(photoUrl as string)) {
    throw new Error("Please Enter a valid URL")
  }

  const isAllowedUpdate = Object.keys(req.body).every(field => ALLOWED_UPDATES.includes(field))
  return isAllowedUpdate

}

export const validateChangePassword = (req: ReuqestWithBody) => {
  const { password, confirmPassword } = req.body

  if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter a strong password")
  } else if (password !== confirmPassword) {
    throw new Error("Password and confirm password do not match")
  }

}