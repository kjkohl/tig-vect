document.getElementById('upload-form').addEventListener('submit', async function e() {
    e.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const status = document.getElementById('status');
    const downloadLink = document.getElementById('downloadLink');

    if (fileInput.files.length === 0) {
        status.textContent = 'Please upload an image.';
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async function (event) {
        const image = new Image();
        image.src = event.target.result;

        image.onload = async function () {
            try {

                const svg = await Potrace.trace(image.src, { optTolerance: 1});

                const blob = new Blob([svg], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);

                downloadLink.href = url;
                downloadLink.style.display = 'block';
                status.textContent = 'Your image has been vectorized! Click the link below to download the vector.';
            } catch (err) {
                console.error('Error:', err);
                status.textContent = 'Failed to vectorize image.'
            }
        };
    };

    reader.readAsDataURL(file);
})
