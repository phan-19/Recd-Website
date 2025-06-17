import './home.css';

import Card from "../../components/assets/card/card";

export default function Home() {
    return (
        <main>
            <div>
                <h2 className='section-title'>
                    Recommended for You
                </h2>
                <div className='card-list'>
                    <Card 
                        cardStyle='card'
                        title='Test Item'
                        type='Film'
                        rating='4.5/5'
                        description='This is a test of the card feature. How does it look?'
                        image='/the-batman.png'
                    />
                </div>
            </div>
        </main>
        
    );
}