const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const fullStars = Math.floor(rating);
    return (
        <span className="star-rating">
            {Array.from({ length: 5 }, (_, i) => (
                <span key={i} style={{ color: i < fullStars ? 'gold' : '#ccc' }}>★</span>
            ))}
        </span>
    );
};

export default StarRating;
