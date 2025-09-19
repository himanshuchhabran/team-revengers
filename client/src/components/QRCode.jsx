import React, { useState, useEffect } from 'react';
import qrcodegen from './qrcodegen.js';

const QRCode = ({ value }) => {
    const [svg, setSvg] = useState("");
    useEffect(() => {
        const qr = qrcodegen.QrCode.encodeText(value, qrcodegen.Ecc.MEDIUM);
        let svgString = qr.toSvgString(4);
        
        // Parse the SVG string to remove unwanted attributes
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgString, "image/svg+xml");
            const svgElement = doc.querySelector('svg');
            if (svgElement) {
                svgElement.removeAttribute('stroke'); // Remove stroke="none"
                // Optionally, remove XML declaration if it causes issues
                // svgString = new XMLSerializer().serializeToString(doc);
                svgString = svgElement.outerHTML;
            }
        } catch (e) {
            console.error("Error parsing SVG:", e);
        }

        console.log("Processed SVG:", svgString);
        setSvg(svgString);
    }, [value]);
    return <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} alt="QR Code" style={{ width: '100%', height: '100%', display: 'block', backgroundColor: 'white', objectFit: 'contain' }} />;

};

export default QRCode;