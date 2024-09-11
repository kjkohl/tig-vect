const fileInput = document.getElementById('file-input');
const uploadButton = document.getElementById('upload-button');
const resultContainer = document.getElementById('result-container');
const loadingAnimation = document.getElementById('loading-animation');

uploadButton.addEventListener('click', (e) => {
    e.preventDefault();
    const file = fileInput.files[0];
    loadingAnimation.classList.remove('hidden');

    // Raster-to-vector conversion logic using NiceGUI
    const niceGUI = new NiceGUI();
    niceGUI.loadImage(file).then((image) => {
        const vectorImage = niceGUI.rasterToVector(image);
        const svgString = niceGUI.vectorToSVG(vectorImage);

        // Display the resulting SVG string
        resultContainer.innerHTML = `<p>File uploaded and processed successfully!</p><br><svg width="100%" height="100%">${svgString}</svg>`;

        // Add some cool animations to the result container
        resultContainer.classList.add('animated');
        resultContainer.classList.add('fadeIn');

        // Hide the loading animation
        loadingAnimation.classList.add('hidden');
    }).catch((error) => {
        console.error(error);
        resultContainer.innerHTML = `<p>Error processing file: ${error.message}</p>`;
        loadingAnimation.classList.add('hidden');
    });
});
