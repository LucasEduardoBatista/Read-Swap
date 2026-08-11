export function inicializarLivros() {
let cropper;
    const fotoInput = document.getElementById('foto');
    const cropImage = document.getElementById('cropImage');
    const cropModal = new bootstrap.Modal(document.getElementById('cropModal'));
    const confirmCrop = document.getElementById('confirmCrop');
    const previewSection = document.getElementById('previewSection');
    const previewFinal = document.getElementById('previewFinal');

    fotoInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        cropImage.src = e.target.result;
        cropModal.show();

        if (cropper) cropper.destroy();
        cropper = new Cropper(cropImage, {
          aspectRatio: 3/4,
          viewMode: 1,
          autoCropArea: 1,
          movable: true,
          zoomable: true,
          rotatable: false,
          scalable: false
        });
      };
      reader.readAsDataURL(file);
    });

    confirmCrop.addEventListener('click', function() {
      if (!cropper) return;
      const canvas = cropper.getCroppedCanvas({ width: 300, height: 400 });
      const croppedImage = canvas.toDataURL('image/png');
      previewFinal.src = croppedImage;
      previewSection.classList.remove('d-none');

      // substitui o arquivo original no input
      canvas.toBlob(function(blob) {
        const file = new File([blob], "livro_recortado.png", { type: "image/png" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fotoInput.files = dataTransfer.files;
      });
    });
}
