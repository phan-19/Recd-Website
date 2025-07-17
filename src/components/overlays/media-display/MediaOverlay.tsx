import { useNavigate, useParams } from 'react-router-dom';
import MediaDisplay from './MediaDisplay';

const MediaOverlay = () => {
    const { media_id } = useParams();
    const navigate = useNavigate();

    const handleClose = () => {
        navigate(-1);
    };

    if (!media_id) return null;

    return (
        <MediaDisplay media_id={parseInt(media_id)} onClose={handleClose} />
    );
};

export default MediaOverlay;