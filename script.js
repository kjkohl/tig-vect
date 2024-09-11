function uploadFile() {
    const fileInput = document.getElementById('fileUpload');
    const resultDiv = document.getElementById('result');
    const downloadLink = document.getElementById('downloadLink');

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

            // Display the uploaded image
            resultDiv.innerHTML = `<img src="${img.src}" alt="Uploaded Image"/>`;

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const vectorSVG = rasterToSVG(imageData, canvas.width, canvas.height);

            // Create SVG Blob and set download link
            const svgBlob = new Blob([vectorSVG], {type: 'image/svg+xml'});
            const svgUrl = URL.createObjectURL(svgBlob);
            downloadLink.href = svgUrl;
            downloadLink.style.display = 'inline';
            resultDiv.innerHTML += `<p><a href="${svgUrl}" download="vector-outline.svg">Download SVG</a></p>`;
        };

        img.onerror = function() {
            console.error("Image failed to load.");
            resultDiv.innerHTML = "<p>There was an error loading the image. Please try another file.</p>";
        };
    };

    reader.onerror = function() {
        console.error("FileReader failed to load the image.");
        resultDiv.innerHTML = "<p>There was an error reading the file. Please try again.</p>";
    };

    reader.readAsDataURL(file);
}

function rasterToSVG(imageData, width, height) {
    let svgPath = '';
    const threshold = 128; // Adjust the threshold for better edge detection
    for (let y = 0; y < height; y += 1) { // Smaller step size for more detail
        let pathData = '';
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const alpha = imageData.data[index + 3]; // Get alpha value
            if (alpha > threshold) {
                pathData += `L${x},${y} `;
            }
        }
        if (pathData) {
            svgPath += `M0,${y} ${pathData}L${width},${y} Z `;
        }
    }
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><path d="${svgPath}" fill="none" stroke="black"/></svg>`;
}
