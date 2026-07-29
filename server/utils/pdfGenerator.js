/**
 * PDF Route Summary Generator using PDFKit
 */

const PDFDocument = require('pdfkit');

const generateRoutePDF = (res, routeData) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Set Response Headers for Inline PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Route_${routeData.source}_to_${routeData.destination}.pdf`);

    doc.pipe(res);

    // Document Header & Title
    doc.fillColor('#1e293b')
       .fontSize(24)
       .text('Route Finder - Shortest Path Report', { align: 'center' });
    doc.moveDown(0.3);

    doc.fontSize(10)
       .fillColor('#64748b')
       .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(1.5);

    // Divider Line
    doc.moveTo(50, doc.y)
       .lineTo(545, doc.y)
       .strokeColor('#3b82f6')
       .lineWidth(2)
       .stroke();
    doc.moveDown(1);

    // Summary Card Box
    doc.rect(50, doc.y, 495, 90)
       .fillAndStroke('#f8fafc', '#e2e8f0');

    const cardY = doc.y - 80;
    doc.fillColor('#0f172a').fontSize(14).text(`Source City: ${routeData.source}`, 70, cardY);
    doc.fillColor('#0f172a').fontSize(14).text(`Destination: ${routeData.destination}`, 300, cardY);
    doc.moveDown(0.5);

    doc.fillColor('#2563eb').fontSize(16).text(`Total Distance: ${routeData.distance} KM`, 70, cardY + 30);
    doc.fillColor('#475569').fontSize(12).text(`Algorithm Used: ${routeData.algorithm || 'Dijkstra'}`, 300, cardY + 32);

    doc.y = cardY + 110;
    doc.moveDown(1);

    // Path Breakdown Heading
    doc.fillColor('#1e293b').fontSize(16).text('Step-by-Step Hop Breakdown', 50, doc.y);
    doc.moveDown(0.8);

    // Render Path Table
    const path = routeData.path || [];
    path.forEach((city, index) => {
        const isLast = index === path.length - 1;
        const isFirst = index === 0;
        
        doc.fontSize(12)
           .fillColor(isFirst ? '#059669' : (isLast ? '#dc2626' : '#1e293b'))
           .text(`[Hop ${index + 1}]  ${city} ${isLast ? ' (Destination)' : (isFirst ? ' (Source)' : '')}`);
        
        if (!isLast) {
            doc.fontSize(10).fillColor('#94a3b8').text(`     │  ↓ National Highway Connection`);
        }
        doc.moveDown(0.3);
    });

    doc.moveDown(2);

    // Time Complexity Reference Section
    doc.rect(50, doc.y, 495, 75).fillAndStroke('#eff6ff', '#bfdbfe');
    const compY = doc.y - 65;
    doc.fillColor('#1e40af').fontSize(12).text('Algorithmic Complexity Summary:', 65, compY);
    doc.fillColor('#1e293b').fontSize(10).text('• Time Complexity: O((V + E) log V) using Min-Heap Priority Queue', 65, compY + 20);
    doc.fillColor('#1e293b').fontSize(10).text('• Space Complexity: O(V + E) for Adjacency List & Heap metadata', 65, compY + 35);

    doc.moveDown(3);

    // Footer
    doc.fontSize(9)
       .fillColor('#94a3b8')
       .text('Route Finder System | University PEP Project | Built with Node.js & Cytoscape.js', 50, 780, { align: 'center' });

    doc.end();
};

module.exports = { generateRoutePDF };
