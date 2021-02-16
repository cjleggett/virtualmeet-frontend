const units = {
  Miles: 1,
  Kilometers: 2,
  Meters: 3,
  Yards: 4,
};

let reverseUnits = {};
for (const key in units) {
  reverseUnits[`${units[key]}`] = key;
}

const genders = [
  "Man",
  "Woman",
  "Nonbinary Person",
  "Other",
  "Prefer not to say",
];

const genderPlurals = {
  Man: "Men",
  Woman: "Women",
  "Nonbinary Person": "Nonbinary People",
  Other: "Other",
  "Prefer not to say": "People who chose not to say",
};

module.exports = {
  units,
  reverseUnits,
  genders,
  genderPlurals,
};
