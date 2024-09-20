document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
document.getElementById('convertBtn').addEventListener('click', convertToVector);

let uploadedImage = null;
let imageURL = '';

function handleImageUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const img = new Image();
    img.src = e.target.result;
    imageURL = e.target.result;  // Save the image data URL for tracing
    img.onload = function() {
      uploadedImage = img; // Save the image element for processing
      document.getElementById('preview').innerHTML = ''; // Clear preview
      document.getElementById('preview').appendChild(img); // Show uploaded image
    };
  };

  reader.readAsDataURL(file);
}

function convertToVector() {
  if (!uploadedImage) {
    alert("Please upload an image first.");
    return;
  }

  // Use Potrace to trace the uploaded image and convert it to SVG
  Potrace.loadImageFromUrl(imageURL, function () {
    Potrace.setParameter({
      color: "black", // Output color
      background: "transparent", // Background transparency
    });

    Potrace.process(function (svg) {
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      const downloadLink = document.getElementById('downloadLink');
      downloadLink.href = url;
      downloadLink.style.display = 'block';
    });
  });
}
