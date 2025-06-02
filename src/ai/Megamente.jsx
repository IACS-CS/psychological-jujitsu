export const megamente = {
  name: "Mega mente.",
  icon: "https://www.sensacine.com.mx/peliculas/pelicula-127741/fotos/foto/", // puedes poner un link de imagen aquí
  getNextCard: (hand, targets, opponentPlays) => {
    let nextTarget = targets[targets.length - 1];

    // Si la carta objetivo es 10, 9 o 11, intenta jugar la carta más grande disponible (13, 12, 11)
    if (nextTarget === 10 || nextTarget === 9 || nextTarget === 8 || nextTarget === 7 ) {
      // Busca la carta más grande posible entre 13, 12, 11
      const bigCards = [13, 12, 11];
      for (let card of bigCards) {
        if (hand.includes(card)) {
          return card;
        }
      }
      // Si no tiene ninguna de esas, juega la carta más alta disponible
      return Math.max(...hand);
    }

    // Si no es 10, 9 ni 11, juega la carta más baja disponible
    return Math.min(...hand);
  },
};
