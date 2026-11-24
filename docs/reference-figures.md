# Reference figures

Figures quoted for context. The pipeline does not read them; the demand is an assumption (see [methodology.md](methodology.md)).

## Census of India 2011, population

The 2011 census is the latest; the 2021 census was postponed. District figures are the 2011 counts re-grouped into the districts drawn in 2016.

| Figure | Value |
| --- | --- |
| Telangana residents | 35,003,674 |
| Hyderabad district | 3,943,323 |
| Ranga Reddy district | 2,446,265 |
| Medchal–Malkajgiri district | 2,440,073 |
| Telangana growth, 2001 to 2011 | about 1.3% a year (30.8 million to 35.0 million) |

Sources: Census of India 2011 as tabulated by citypopulation.de and the district pages on Wikipedia. Verify against the Census of India tables before client use.

## Use in the app

`analytics.population` in `config.js` holds these figures. Analytics shows them as context and projects the state total at the 2001–2011 growth rate, which is a rough illustration, not a forecast.
