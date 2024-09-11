function uploadFile() {
    const fileInput = document.getElementById('fileUpload');
    const resultDiv = document.getElementById('result');
    const downloadSVGButton = document.getElementById('downloadSVG');

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
            // Display the uploaded image
            resultDiv.innerHTML = `<img src="${img.src}" alt="Uploaded Image"/>`;

            // Prepare the SVG with the image
            const svgData = createSVGWithImage(img.src, img.width, img.height);
            
            // Create SVG Blob and set download link
            const svgBlob = new Blob([svgData], {type: 'image/svg+xml'});
            const svgUrl = URL.createObjectURL(svgBlob);
            downloadSVGButton.href = svgUrl;
            downloadSVGButton.style.display = 'inline';
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

function createSVGWithImage(imageSrc, width, height) {
    return `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <image href="${imageSrc}" width="${width}" height="${height}" />
        </svg>
    `;
}
