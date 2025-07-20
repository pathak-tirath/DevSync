export interface IUser {
  firstName: string;
  lastName?: string;
  age?: number;
  email: string;
  password: string;
  gender?: "male" | "female" | "others";
  photoUrl?: string;
  about?: string;
  skills?: string[];
  getJWT?:() => void;
  isPasswordValid? :(password:string) => void;
  sayHello?: () => void;
}
