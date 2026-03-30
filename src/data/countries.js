export const COUNTRIES = {
  japan: { id: 'japan', name: 'Japón', flag: '🇯🇵' },
  usa: { id: 'usa', name: 'Estados Unidos', flag: '🇺🇸' },
  germany: { id: 'germany', name: 'Alemania', flag: '🇩🇪' },
  france: { id: 'france', name: 'Francia', flag: '🇫🇷' },
  spain: { id: 'spain', name: 'España', flag: '🇪🇸' },
  korea: { id: 'korea', name: 'Corea del Sur', flag: '🇰🇷' },
  brazil: { id: 'brazil', name: 'Brasil', flag: '🇧🇷' },
  uk: { id: 'uk', name: 'Reino Unido', flag: '🇬🇧' },
  mexico: { id: 'mexico', name: 'México', flag: '🇲🇽' },
  canada: { id: 'canada', name: 'Canadá', flag: '🇨🇦' },
  australia: { id: 'australia', name: 'Australia', flag: '🇦🇺' },
  china: { id: 'china', name: 'China', flag: '🇨🇳' },
  india: { id: 'india', name: 'India', flag: '🇮🇳' },
  russia: { id: 'russia', name: 'Rusia', flag: '🇷🇺' },
  sweden: { id: 'sweden', name: 'Suecia', flag: '🇸🇪' },
  poland: { id: 'poland', name: 'Polonia', flag: '🇵🇱' },
  turkey: { id: 'turkey', name: 'Turquía', flag: '🇹🇷' },
  greenland: { id: 'greenland', name: 'Groenlandia', flag: '🇬🇱' },
  argentina: { id: 'argentina', name: 'Argentina', flag: '🇦🇷' },
  colombia: { id: 'colombia', name: 'Colombia', flag: '🇨🇴' },
  seasia: { id: 'seasia', name: 'Sudeste Asiático', flag: '🌏' },
  northafrica: { id: 'northafrica', name: 'Norte de África', flag: '🌍' },
  subsafrica: { id: 'subsafrica', name: 'África subsahariana', flag: '🌍' },

  italy: { id: 'italy', name: 'Italia', flag: '🇮🇹' },
  greece: { id: 'greece', name: 'Grecia', flag: '🇬🇷' },
  balkans: { id: 'balkans', name: 'Balcanes', flag: '🌍' },
}

export function getCountryLabel(countryId) {
  return COUNTRIES[countryId] ?? { id: countryId, name: countryId, flag: '🌍' }
}

