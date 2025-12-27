// Home.tsx
import React from 'react';
import "./Home.css"
import Dashboard from './Dashboard/Dashboard';
import Highlights from './Highlights/Highlights';
import MoreInfo from './MoreInfo/MoreInfo';

interface HomeProps {
    entered: boolean;
}


const Home: React.FC<HomeProps> = ({ entered }) => {

    if (!entered) return null;

    return (
        <div className='w-full'>

            <Dashboard />

            <div className="section-divider">
                <h1 className="title text-shadow-white">精彩瞬间</h1>
                <div className='bar bar1'></div>
                <div className='relative'>
                    <div className='bar bar2'></div>
                    <div className='bar bar3'></div>
                </div>

            </div>

            <Highlights />

            <MoreInfo />
        </div>
    )
}

export default Home;
