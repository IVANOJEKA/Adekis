import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const QRCodeSVG = ({ value, size = 128 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current && value) {
            // Generate real scannable QR code with optimal settings
            QRCode.toCanvas(canvasRef.current, value, {
                width: size * 2, // Double resolution for better scanning
                margin: 2, // Larger margin for better camera recognition
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                errorCorrectionLevel: 'M', // Medium error correction (H can make QR too dense)
                scale: 8 // Higher scale for better quality
            }, (error) => {
                if (error) console.error('QR Code generation error:', error);
            });
        }
    }, [value, size]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                display: 'block',
                imageRendering: 'pixelated' // Crisp edges for QR code
            }}
        />
    );
};

export default QRCodeSVG;
