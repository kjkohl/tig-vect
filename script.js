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

            // Convert to vector using Potrace
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);

            canvas.toBlob(async (blob) => {
                const arrayBuffer = await blob.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);

                // Initialize Potrace
                const potrace = new Potrace();
                potrace.loadImage(uint8Array);

                potrace.getSVG((svg) => {
                    // Prepare the SVG for download
                    const svgBlob = new Blob([svg], {type: 'image/svg+xml'});
                    const svgUrl = URL.createObjectURL(svgBlob);

                    // Update the download button
                    downloadSVGButton.href = svgUrl;
                    downloadSVGButton.download = 'vector.svg';
                    downloadSVGButton.style.display = 'inline';
                });
            }, 'image/png');
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

function downloadSVG() {
    const downloadSVGButton = document.getElementById('downloadSVG');
    downloadSVGButton.click();
}
