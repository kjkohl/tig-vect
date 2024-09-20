document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
document.getElementById('convertBtn').addEventListener('click', convertToVector);

function handleImageUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const img = document.createElement('img');
    img.src = e.target.result;
    img.style.maxWidth = '100%';
    document.getElementById('preview').innerHTML = '';
    document.getElementById('preview').appendChild(img);
  };

  reader.readAsDataURL(file);
}

function convertToVector() {
  const svgContent = generateSVG(); // Mock SVG content for now
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.getElementById('downloadLink');
  downloadLink.href = url;
  downloadLink.style.display = 'block';
}

// Mock function to simulate SVG generation
function generateSVG() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
    </svg>
  `;
}
