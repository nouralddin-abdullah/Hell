export interface SignUpForm {
  fullName: string;
  username: string;
  email: string;
  group: "A" | "B" | "C" | "D" | "";
  password: string;
  passwordConfirm: string;
  photo?: string;
}
