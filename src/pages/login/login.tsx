import UserLogin from "../../components/user-login/UserLogin";

type LoginProps = {
    onLogin: (user: { user_id: number, username: string, bio: string }) => void;
};

export default function Login({onLogin}: LoginProps) {
    return (
        <main>
            <UserLogin onLogin={onLogin}/>
        </main>
        
    );
}