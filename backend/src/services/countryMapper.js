// ISO alpha-2 → our DB country_id
// Countries not listed here remain unmapped (null) for now
const ISO_TO_ID = {
  // East Asia
  JP: 'japan', KR: 'korea', CN: 'china', TW: 'china', HK: 'china', MO: 'china',

  // Americas
  US: 'usa', CA: 'canada', MX: 'mexico', BR: 'brazil', AR: 'argentina',
  CO: 'colombia', CL: 'argentina', PE: 'colombia', VE: 'colombia', UY: 'argentina',

  // Western Europe
  GB: 'uk',  IE: 'uk',
  DE: 'germany', AT: 'germany', CH: 'germany', LI: 'germany',
  FR: 'france', BE: 'france', LU: 'france', MC: 'france',
  ES: 'spain',  PT: 'spain',
  IT: 'italy',  SM: 'italy',  VA: 'italy',
  NL: 'germany',

  // Nordic
  SE: 'sweden', FI: 'sweden', NO: 'sweden', DK: 'sweden', IS: 'sweden',

  // Eastern / Central Europe → balkans
  PL: 'poland',
  CZ: 'balkans', SK: 'balkans', HU: 'balkans', RO: 'balkans', BG: 'balkans',
  RS: 'balkans', HR: 'balkans', SI: 'balkans', BA: 'balkans', ME: 'balkans',
  MK: 'balkans', AL: 'balkans', XK: 'balkans',
  UA: 'balkans', BY: 'balkans', MD: 'balkans', LT: 'balkans', LV: 'balkans',
  EE: 'balkans',

  // Southern Europe
  GR: 'greece', CY: 'greece',

  // Russia & surroundings
  RU: 'russia', KZ: 'russia', GE: 'russia', AM: 'russia', AZ: 'russia',

  // South / Southeast Asia
  IN: 'india', PK: 'india', BD: 'india', LK: 'india', NP: 'india',
  SG: 'seasia', TH: 'seasia', VN: 'seasia', ID: 'seasia', PH: 'seasia',
  MY: 'seasia', MM: 'seasia', KH: 'seasia',

  // Middle East → turkey placeholder
  TR: 'turkey', IL: 'turkey', AE: 'turkey', SA: 'turkey', IR: 'turkey',
  IQ: 'turkey', JO: 'turkey', LB: 'turkey',

  // Oceania
  AU: 'australia', NZ: 'australia',

  // Africa
  EG: 'northafrica', MA: 'northafrica', TN: 'northafrica', DZ: 'northafrica',
  LY: 'northafrica', SD: 'northafrica',
  ZA: 'subsafrica',  NG: 'subsafrica', KE: 'subsafrica', GH: 'subsafrica',
  ET: 'subsafrica',  TZ: 'subsafrica', UG: 'subsafrica', SN: 'subsafrica',

  // Arctic
  GL: 'greenland',
}

export function isoToCountryId(isoCode) {
  if (!isoCode) return null
  return ISO_TO_ID[isoCode.trim().toUpperCase()] ?? null
}
