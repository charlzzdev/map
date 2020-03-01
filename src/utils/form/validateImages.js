const validateImages = (images, errorDiv) => {
  if (!images.length) {
    errorDiv.innerText = 'Nincsenek képek kiválasztva.';
    return false;
  }

  for (let i = 0; i < images.length; i++) {
    const sequenceNumber = parseInt(images[i].name.split('_')[0]);
    if (!sequenceNumber) {
      errorDiv.innerText = `A sorszám 0 vagy nincs megadva az összes kép nevében.
        Példa: 1_Kép neve.png
      `;
      return false;
    }
  }

  return true;
}

export default validateImages;