function cls(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function WorldMapSvg({ highlightedCountryId, gameCountsByCountryId, onSelectCountryId }) {
  const countFor = (id) => gameCountsByCountryId[id] ?? 0
  const hasGames = (id) => countFor(id) > 0
  const pathClass = (id) =>
    cls(
      'country-path',
      hasGames(id) ? 'has-games' : '',
      highlightedCountryId === id ? 'highlighted' : '',
    )

  const select = (id) => onSelectCountryId(id)

  return (
    <svg className="map-svg" viewBox="0 0 900 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="500" fill="#060A14" />

      {/* Ocean texture lines */}
      <line x1="0" y1="50" x2="900" y2="50" stroke="#0A1020" strokeWidth="1" />
      <line x1="0" y1="100" x2="900" y2="100" stroke="#0A1020" strokeWidth="1" />
      <line x1="0" y1="150" x2="900" y2="150" stroke="#0A1020" strokeWidth="1" />
      <line x1="0" y1="200" x2="900" y2="200" stroke="#0A1020" strokeWidth="1" />
      <line x1="0" y1="250" x2="900" y2="250" stroke="#0A1020" strokeWidth="1" />
      <line x1="0" y1="300" x2="900" y2="300" stroke="#0A1020" strokeWidth="1" />
      <line x1="0" y1="350" x2="900" y2="350" stroke="#0A1020" strokeWidth="1" />
      <line x1="0" y1="400" x2="900" y2="400" stroke="#0A1020" strokeWidth="1" />
      <line x1="0" y1="450" x2="900" y2="450" stroke="#0A1020" strokeWidth="1" />
      <line x1="50" y1="0" x2="50" y2="500" stroke="#0A1020" strokeWidth="1" />
      <line x1="150" y1="0" x2="150" y2="500" stroke="#0A1020" strokeWidth="1" />
      <line x1="250" y1="0" x2="250" y2="500" stroke="#0A1020" strokeWidth="1" />
      <line x1="350" y1="0" x2="350" y2="500" stroke="#0A1020" strokeWidth="1" />
      <line x1="450" y1="0" x2="450" y2="500" stroke="#0A1020" strokeWidth="1" />
      <line x1="550" y1="0" x2="550" y2="500" stroke="#0A1020" strokeWidth="1" />
      <line x1="650" y1="0" x2="650" y2="500" stroke="#0A1020" strokeWidth="1" />
      <line x1="750" y1="0" x2="750" y2="500" stroke="#0A1020" strokeWidth="1" />
      <line x1="850" y1="0" x2="850" y2="500" stroke="#0A1020" strokeWidth="1" />

      {/* CONTINENTS - simplified shapes */}
      <path
        id="canada"
        className={pathClass('canada')}
        d="M30,60 L180,55 L190,90 L160,100 L170,120 L130,140 L80,130 L50,110 Z"
        onClick={() => select('canada')}
      />
      <path
        id="usa"
        className={pathClass('usa')}
        d="M80,145 L175,135 L190,160 L170,190 L120,195 L75,180 Z"
        onClick={() => select('usa')}
      />
      <path
        id="mexico"
        className={pathClass('mexico')}
        d="M85,200 L150,195 L145,230 L110,240 L85,225 Z"
        onClick={() => select('mexico')}
      />

      <path
        id="uk"
        className={pathClass('uk')}
        d="M360,90 L385,85 L388,110 L365,115 Z"
        onClick={() => select('uk')}
      />
      <path
        id="france"
        className={pathClass('france')}
        d="M380,120 L415,115 L420,150 L385,155 Z"
        onClick={() => select('france')}
      />
      <path
        id="spain"
        className={pathClass('spain')}
        d="M360,155 L400,152 L402,180 L358,182 Z"
        onClick={() => select('spain')}
      />
      <path
        id="germany"
        className={pathClass('germany')}
        d="M410,110 L445,108 L448,140 L412,142 Z"
        onClick={() => select('germany')}
      />
      <path
        id="sweden"
        className={pathClass('sweden')}
        d="M415,60 L440,55 L445,95 L418,98 Z"
        onClick={() => select('sweden')}
      />
      <path
        id="poland"
        className={pathClass('poland')}
        d="M445,110 L475,108 L478,135 L448,137 Z"
        onClick={() => select('poland')}
      />

      <path
        id="russia"
        className={pathClass('russia')}
        d="M460,50 L700,45 L705,130 L580,135 L480,125 L462,90 Z"
        onClick={() => select('russia')}
      />

      <path
        id="japan"
        className={pathClass('japan')}
        d="M750,130 L770,125 L775,160 L755,165 Z"
        onClick={() => select('japan')}
      />

      <path
        id="korea"
        className={pathClass('korea')}
        d="M720,130 L745,128 L747,155 L722,158 Z"
        onClick={() => select('korea')}
      />

      <path
        id="china"
        className={pathClass('china')}
        d="M620,110 L718,108 L720,170 L680,180 L620,175 L615,145 Z"
        onClick={() => select('china')}
      />

      <path
        id="india"
        className={pathClass('india')}
        d="M580,180 L630,175 L635,240 L600,260 L570,240 Z"
        onClick={() => select('india')}
      />

      <path
        id="turkey"
        className={pathClass('turkey')}
        d="M470,155 L530,152 L535,175 L472,178 Z"
        onClick={() => select('turkey')}
      />

      <path
        id="northafrica"
        className={pathClass('northafrica')}
        d="M360,200 L510,195 L515,280 L362,285 Z"
        onClick={() => select('northafrica')}
      />
      <path
        id="subsafrica"
        className={pathClass('subsafrica')}
        d="M370,290 L510,285 L505,380 L430,400 L365,380 Z"
        onClick={() => select('subsafrica')}
      />

      <path
        id="brazil"
        className={pathClass('brazil')}
        d="M170,255 L260,250 L265,360 L200,380 L160,350 L155,300 Z"
        onClick={() => select('brazil')}
      />
      <path
        id="argentina"
        className={pathClass('argentina')}
        d="M165,360 L230,355 L220,430 L175,440 Z"
        onClick={() => select('argentina')}
      />
      <path
        id="colombia"
        className={pathClass('colombia')}
        d="M155,240 L195,235 L200,260 L158,265 Z"
        onClick={() => select('colombia')}
      />

      <path
        id="australia"
        className={pathClass('australia')}
        d="M720,290 L820,285 L825,370 L730,375 Z"
        onClick={() => select('australia')}
      />

      <path
        id="greenland"
        className={pathClass('greenland')}
        d="M220,30 L280,25 L285,65 L225,70 Z"
        onClick={() => select('greenland')}
      />

      <path
        id="seasia"
        className={pathClass('seasia')}
        d="M660,200 L720,195 L725,255 L665,260 Z"
        onClick={() => select('seasia')}
      />

      {/* PINS */}
      <g className="map-pin" onClick={() => select('japan')}>
        <circle cx="762" cy="138" r="14" fill="rgba(212,160,23,0.15)" stroke="rgba(212,160,23,0.4)" strokeWidth="1" />
        <circle cx="762" cy="138" r="6" fill="#D4A017" />
        <text x="762" y="142" textAnchor="middle" fill="#0D0D0F" fontSize="8" fontWeight="700" fontFamily="monospace">
          {countFor('japan') || 6}
        </text>
      </g>
      <g className="map-pin" onClick={() => select('usa')}>
        <circle cx="135" cy="162" r="10" fill="rgba(212,160,23,0.12)" stroke="rgba(212,160,23,0.35)" strokeWidth="1" />
        <circle cx="135" cy="162" r="5" fill="#9B7410" />
        <text x="135" y="166" textAnchor="middle" fill="#E8D080" fontSize="7" fontWeight="700" fontFamily="monospace">
          {countFor('usa') || 3}
        </text>
      </g>
      <g className="map-pin" onClick={() => select('korea')}>
        <circle cx="734" cy="141" r="9" fill="rgba(212,160,23,0.12)" stroke="rgba(212,160,23,0.35)" strokeWidth="1" />
        <circle cx="734" cy="141" r="4" fill="#9B7410" />
        <text x="734" y="145" textAnchor="middle" fill="#E8D080" fontSize="7" fontWeight="700" fontFamily="monospace">
          {countFor('korea') || 2}
        </text>
      </g>
      <g className="map-pin" onClick={() => select('germany')}>
        <circle cx="430" cy="124" r="9" fill="rgba(212,160,23,0.12)" stroke="rgba(212,160,23,0.35)" strokeWidth="1" />
        <circle cx="430" cy="124" r="4" fill="#9B7410" />
        <text x="430" y="128" textAnchor="middle" fill="#E8D080" fontSize="7" fontWeight="700" fontFamily="monospace">
          {countFor('germany') || 2}
        </text>
      </g>
      <g className="map-pin" onClick={() => select('france')}>
        <circle cx="400" cy="133" r="7" fill="rgba(212,160,23,0.1)" stroke="rgba(212,160,23,0.25)" strokeWidth="1" />
        <circle cx="400" cy="133" r="3" fill="#9B7410" />
      </g>
      <g className="map-pin" onClick={() => select('spain')}>
        <circle cx="381" cy="167" r="7" fill="rgba(212,160,23,0.1)" stroke="rgba(212,160,23,0.25)" strokeWidth="1" />
        <circle cx="381" cy="167" r="3" fill="#9B7410" />
      </g>
      <g className="map-pin" onClick={() => select('brazil')}>
        <circle cx="215" cy="310" r="7" fill="rgba(212,160,23,0.1)" stroke="rgba(212,160,23,0.25)" strokeWidth="1" />
        <circle cx="215" cy="310" r="3" fill="#9B7410" />
      </g>

      {/* Equator line */}
      <line x1="0" y1="245" x2="900" y2="245" stroke="rgba(212,160,23,0.08)" strokeWidth="1" strokeDasharray="8 4" />
      <text x="10" y="242" fill="rgba(212,160,23,0.2)" fontSize="8" fontFamily="monospace">
        EQ
      </text>

      {/* Coordinate labels */}
      <text x="10" y="15" fill="#1C2438" fontSize="9" fontFamily="monospace">
        90°N
      </text>
      <text x="10" y="490" fill="#1C2438" fontSize="9" fontFamily="monospace">
        90°S
      </text>
    </svg>
  )
}

