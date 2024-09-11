const Potrace = require('potrace');

function uploadFile () {
  const fileInput = document.getElementById('fileUpload');
  const resultDiv = document.getElementById('result');

  if (fileInput.files.length === 0) {
    resultDiv.innerHTML = "<p>Please upload a file first.</p>";
    return;
  }

  const file = fileInput.files[0];
  if (!file.type.startsWith('image/')) {
    resultDiv.innerHTML = "<p>Only image files are supported.</p>"
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const img =  new Image();
    img.src = event.target.result;

    Potrace.trace(img.src, function(err, svg) {
      if (err) {
        resultDiv.innerHTML = "<p>Conversion failed.</p>";
        return;
      }

      resultDiv.innerHTML = `<div>${svg}</div>`;
    });
  };
    reader.readAsDataURL(file);
}
