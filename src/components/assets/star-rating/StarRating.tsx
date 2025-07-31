const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const fullStars = Math.floor(rating);
    return (
        <span className="star-rating">
            {Array.from({ length: 5 }, (_, i) => (
                <span key={i} style={{ color: i < fullStars ? 'rgba(170, 149, 28, 1)' : '#686868ff' }}>★</span>
            ))}
        </span>
    );
};

export default StarRating;
