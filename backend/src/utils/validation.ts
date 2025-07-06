import validator from "validator";

interface SignupBody {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  age?: number;
  gender?: "Male" | "Female" | "Others";
}

interface ReuqestWithBody {
  body: SignupBody;
}

export const validateSignUp = (req: ReuqestWithBody) => {
  const { firstName, lastName, email, password, age, gender } = req.body;
  let regularExpression =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

  if (firstName && !firstName) {
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
