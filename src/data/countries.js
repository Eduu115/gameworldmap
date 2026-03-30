export const COUNTRIES = {
  japan: { id: 'japan', name: 'Japan', flag: '🇯🇵' },
  usa: { id: 'usa', name: 'United States', flag: '🇺🇸' },
  germany: { id: 'germany', name: 'Germany', flag: '🇩🇪' },
  france: { id: 'france', name: 'France', flag: '🇫🇷' },
  spain: { id: 'spain', name: 'España', flag: '🇪🇸' },
  korea: { id: 'korea', name: 'South Korea', flag: '🇰🇷' },
  brazil: { id: 'brazil', name: 'Brazil', flag: '🇧🇷' },
  uk: { id: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
  mexico: { id: 'mexico', name: 'México', flag: '🇲🇽' },
  canada: { id: 'canada', name: 'Canada', flag: '🇨🇦' },
  australia: { id: 'australia', name: 'Australia', flag: '🇦🇺' },
  china: { id: 'china', name: 'China', flag: '🇨🇳' },
  india: { id: 'india', name: 'India', flag: '🇮🇳' },
  russia: { id: 'russia', name: 'Russia', flag: '🇷🇺' },
  sweden: { id: 'sweden', name: 'Sweden', flag: '🇸🇪' },
  poland: { id: 'poland', name: 'Poland', flag: '🇵🇱' },
  turkey: { id: 'turkey', name: 'Turkey', flag: '🇹🇷' },
  greenland: { id: 'greenland', name: 'Greenland', flag: '🇬🇱' },
  argentina: { id: 'argentina', name: 'Argentina', flag: '🇦🇷' },
  colombia: { id: 'colombia', name: 'Colombia', flag: '🇨🇴' },
  seasia: { id: 'seasia', name: 'Southeast Asia', flag: '🌏' },
  northafrica: { id: 'northafrica', name: 'North Africa', flag: '🌍' },
  subsafrica: { id: 'subsafrica', name: 'Sub-Saharan Africa', flag: '🌍' },
}

export function getCountryLabel(countryId) {
  return COUNTRIES[countryId] ?? { id: countryId, name: countryId, flag: '🌍' }
}

