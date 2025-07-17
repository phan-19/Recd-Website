import { useNavigate, useParams } from 'react-router-dom';
import ProfileDisplay from './ProfileDisplay';

const ProfileOverlay = () => {
    const { user_id } = useParams();
    const navigate = useNavigate();

    const handleClose = () => {
        navigate(-1);
    };

    if (!user_id) return null;

    return (
        <ProfileDisplay user_id={parseInt(user_id)} onClose={handleClose} />
    );
};

export default ProfileOverlay;