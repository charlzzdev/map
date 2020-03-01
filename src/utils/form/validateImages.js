const validateImages = (images, errorDiv) => {
  if (!images.length) {
    errorDiv.innerText = 'Nincsenek képek kiválasztva.';
    return false;
  }

  for (let i = 0; i < images.length; i++) {
    const startsWithDateFollowedBy_ = /^[0-9]{4}\.[0-9]{2}\.[0-9]{2}\._/;

    if (!startsWithDateFollowedBy_.test(images[i].name)) {
      errorDiv.innerText = `A dátum nincs a kép nevében vagy hibásan van megadva.
        Példa: 2020.03.01._Kép neve.png
      `;
      return false;
    }
  }

  return true;
}

export default validateImages;