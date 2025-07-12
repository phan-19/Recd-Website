import UserLogin from "../../components/user-login/UserLogin";

// Temporary Page: I would eventually like the login promt to appear
// when the user clicks profile and isn't logged in
export default function Login() {
    const handleLogin = (username: string, password: string) => {
        console.log('User logged in:', {username, password});
    }
    return (
        <main>
            <UserLogin onLogin={handleLogin}/>
        </main>
        
    );
}