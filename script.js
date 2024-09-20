document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
document.getElementById('convertBtn').addEventListener('click', convertToVector);

let uploadedImage = null;

function handleImageUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const img = new Image();
    img.src = e.target.result;
    img.onload = function() {
      uploadedImage = img; // Save image element to get its dimensions later
      document.getElementById('preview').innerHTML = ''; // Clear preview
      document.getElementById('preview').appendChild(img); // Show the uploaded image
    };
  };

  reader.readAsDataURL(file);
}

function convertToVector() {
  if (!uploadedImage) {
    alert("Please upload an image first.");
    return;
  }

  const width = uploadedImage.width;
  const height = uploadedImage.height;
  const svgContent = generateSVG(width, height); // Pass dynamic dimensions

  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.getElementById('downloadLink');
  downloadLink.href = url;
  downloadLink.style.display = 'block';
}

// Generate SVG with dynamic width/height based on the uploaded image
function generateSVG(width, height) {
  // Replace this placeholder with actual vector tracing logic
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <path d="M0,${height/2} Q ${width/2},0 ${width},${height/2} T ${width * 2},${height/2}" 
            stroke="black" fill="none" stroke-width="2"/>
    </svg>
  `;
}
