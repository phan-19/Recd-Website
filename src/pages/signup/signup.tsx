import UserSignup from "../../components/user-signup/UserSignup";

type User = {
  user_id: number;
  username: string;
  bio: string;
};

type SignupProps = {
  onSignup: (user: User) => void;
};

export default function Signup({ onSignup }: SignupProps) {
  return (
    <main>
      <UserSignup onSignup={onSignup} />
    </main>
  );
}
