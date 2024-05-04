// ImageModal.js
import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const ImageModal = ({ selectedImage, setSelectedImage }) => {
    return selectedImage && (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: '100%',
            maxWidth: '648px',
            margin: 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: "flex",
            justifyContent: 'center', // Add this
            alignItems: 'center', // Add this
        }} onClick={() => setSelectedImage(null)}>
            <TransformWrapper>
                <TransformComponent>
                    <img
                        src={selectedImage}
                        alt="Selected"
                        style={{maxWidth: '100%', maxHeight: '100vh', padding: '50px'}}
                    />
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
};

export default ImageModal;