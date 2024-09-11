function uploadFile() {
    const fileInput = document.getElementById('fileUpload');
    const resultDiv = document.getElementById('result');

    if (fileInput.files.length === 0) {
        resultDiv.innerHTML = "<p>Please upload a file first.</p>";
        return;
    }

    const file = fileInput.files[0];
    if (!file.type.startsWith('image/')) {
        resultDiv.innerHTML = "<p>Only image files are supported.</p>";
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function() {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);

            // Create an SVG path based on the image's edges
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const vectorSVG = rasterToSVG(imageData, canvas.width, canvas.height);
            resultDiv.innerHTML = `<svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg">${vectorSVG}</svg>`;
        };
    };
    reader.readAsDataURL(file);
}

function rasterToSVG(imageData, width, height) {
    // Basic implementation of edge detection (simplified)
    let svgPath = '';
    for (let y = 0; y < height; y += 10) { // Simplified step size
        let startX = null;
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const alpha = imageData.data[index + 3]; // Get alpha value
            if (alpha > 128) { // Basic threshold for edge detection
                if (startX === null) {
                    startX = x;
                }
            } else if (startX !== null) {
                svgPath += `M${startX},${y}L${x},${y} `;
                startX = null;
            }
        }
        if (startX !== null) {
            svgPath += `L${width},${y} `;
        }
    }
    return `<path d="${svgPath}" fill="none" stroke="black"/>`;
}
