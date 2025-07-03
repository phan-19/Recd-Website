import './home.css';

import Card from "../../components/assets/card/Card";

export default function Home() {
    return (
        <main>
            <div>
                <h2 className='section-title'>
                    Recommended
                </h2>
                <div className='card-scroll'>
                    <Card
                        cardStyle='card'
                        title='Test Item 1'
                        type='Film'
                        rating='4.5/5'
                        description='This is a test of the card feature. How does it look?'
                        image='/the-batman.png'
                    />
                    <Card
                        cardStyle="card"
                        title='Test Item 2'
                        type='Television Show'
                        rating='3.0/5'
                        description='This is a test of stacking card features. How does it look?'
                        image=''
                    />
                    <Card 
                        cardStyle='card'
                        title='Test Item 3'
                        type='Book'
                        rating='5.0/5'
                        description='This is a test of the scroll feature. How does it look?'
                        image=''
                    />
                    <Card 
                        cardStyle='card'
                        title='Test Item 4'
                        type='Album'
                        rating='2.0/5'
                        description='This is a test of scrolling. Please just scroll. This is also a test of text overflow. Testing overflow. Testing overflow. Testing overflow. Testing overflow. Size page down to see how overflow looks at different amounts.'
                        image=''
                    />
                </div>
                <h2 className='section-title'>
                    Recently Added
                </h2>
                <div className='card-scroll'>
                    
                </div>
            </div>
        </main>
        
    );
}