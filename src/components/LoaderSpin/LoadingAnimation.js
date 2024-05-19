import React from 'react';
import './index.scss'
import LoadingAnimation from './assets/loading.json';
import Lottie from "lottie-react";

const LoaderAnimation = () => {
    return (
        <div className="loader-animation">
            <Lottie animationData={LoadingAnimation} />
        </div>
    );
};

export default LoaderAnimation;
