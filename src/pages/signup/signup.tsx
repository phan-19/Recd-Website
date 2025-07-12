import UserSignup from "../../components/user-signup/UserSignup";

// Temporary Page: I would eventually like the login promt to appear
// when the user clicks profile and isn't logged in
export default function Signup() {
    const handleSignup = (username: string, password: string, bio: string) => {
        console.log('User signed up:', {username, password, bio});
    }
    return (
        <main>
            <UserSignup onSignup={handleSignup}/>
        </main>
        
    );
}