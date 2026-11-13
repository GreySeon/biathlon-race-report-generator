// Competition type
const competition = document.getElementById("competition");
// Venue
const venue = document.getElementById("venue");
const venueDataByCompetition = {
  world_cup: "JSON/world_cup_venues.json",
  ibu_cup: "JSON/ibu_cup_venues.json",
};
let populatedVenues = [];
// Gender
const gender = document.getElementById("gender");
let previousGender = "";
// Race type
const race = document.getElementById("race");
let previousRaceValue = "";
// Biathletes
const biathletes = [
  AthleteResultRow.fromExisting(1),
  AthleteResultRow.fromExisting(2),
  AthleteResultRow.fromExisting(3),
  AthleteResultRow.fromExisting(4),
  AthleteResultRow.fromExisting(5),
  AthleteResultRow.fromExisting(6),
];
let populatedBiathletes = [];
const winnerTimeLabel = document.getElementById("winner_time_label");

const addRowsButton = document.getElementById("add_rows");
const deleteRowsButton = document.getElementById("delete_rows");

const generateTextButton = document.getElementById("generate_text");

// Race helpers
function isRelayRaceValue(value) {
  return (
    value === "classic" ||
    value === "mixed" ||
    value === "single"
  );
}

// Compares whether the previous and current race types are both relay or non-relay
function shouldClearOnRaceChange(previousValue, nextValue) {
  return isRelayRaceValue(previousValue) !== isRelayRaceValue(nextValue);
}

function clearAthleteRows() {
  for (const athlete of biathletes) {
    athlete.list.replaceChildren();
    athlete.name.value = "";
  }
}

// Shooting helpers
function getShootingRules() {
  if (isRelayRaceValue(race.value)) {
    return {
      maxLength: 2,
      maxValue: 24,
    };
  } else {
    return {
      maxLength: 1,
      maxValue: 5,
    };
  }
}

function changeShootingFormat(input) {
  let value = input.value.replace(/\D/g, "");

  const rules = getShootingRules();
  input.maxLength = rules.maxLength;

  value = value.slice(0, rules.maxLength);

  if (Number(value) > rules.maxValue) {
    value = value.slice(0, -1);
  }

  if (!isRelayRaceValue(race.value)) {
    value = value.replace(/[6-9]/g, "").slice(0, 1);
  }

  input.value = value;
}

function disableShooting() {
  for (const biathlete of biathletes) {
    const shouldDisableLastShots =
      isRelayRaceValue(race.value) || race.value === "sprint";
    biathlete.shooting[2].disabled = shouldDisableLastShots;
    biathlete.shooting[3].disabled = shouldDisableLastShots;
  }
}

// Time helpers
function addHours() {
  if (race.value == "classic" || race.value == "mixed") {
    winnerTimeLabel.textContent = "Час: 1:";
  } else {
    winnerTimeLabel.textContent = "Час:";
  }
}

function getTimeParts(biathlete) {
  const [minutes, seconds, tenths] = biathlete.time.map(
    (input) => input.value || "0",
  );
  return {
    minutes: Number(minutes),
    seconds: Number(seconds),
    tenths: Number(tenths),
  };
}

function isWinnerHourRace() {
  return race.value === "classic" || race.value === "mixed";
}

function formatTime(biathlete) {
  const { minutes, seconds, tenths } = getTimeParts(biathlete);

  if (minutes === 0 && seconds === 0 && tenths === 0) {
    return "+0.0";
  }

  if (minutes === 0) {
    return `+${seconds}.${tenths}`;
  }

  if (isWinnerHourRace() && biathlete == biathletes[0]) {
    return `1:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
  }

  if (biathlete == biathletes[0]) {
    return `${minutes}:${String(seconds).padStart(2, "0")}.${tenths}`;
  }

  return `+${minutes}:${String(seconds).padStart(2, "0")}.${tenths}`;
}


function bindAthleteInputHandlers() {
  for (const athlete of biathletes) {
    for (const input of athlete.shooting) {
      input.addEventListener("input", () => changeShootingFormat(input));
    }

    for (const input of athlete.time) {
      input.addEventListener("input", (event) => {
        const value = event.currentTarget.value.replace(/\D/g, "").slice(0, 2);
        event.currentTarget.value =
          Number(value) > 59 ? value.slice(0, 1) : value;
      });
    }
  }
}

async function loadJson(url) {
  const response = await fetch(url);
  return response.json();
}

async function populateVenues() {
  venue.replaceChildren(); // Clear previous options

  const sourceData = venueDataByCompetition[competition.value];
  if (!sourceData) {
    populatedVenues = [];
    return;
  }

  const venues = await loadJson(sourceData);
  populatedVenues = venues;

  const options = venues.map(({ number, flag, stadium }) => {
    return new Option(`${number}. ${flag} ${stadium}`, String(number));
  });

  venue.append(...options); // "..." is used instead of a "for" loop
}

async function loadBiathleteData() {
  const [men, women, countries] = await Promise.all([
    loadJson("JSON/men_biathletes.json"),
    loadJson("JSON/women_biathletes.json"),
    loadJson("JSON/countries.json"),
  ]);

  return { men, women, countries };
}

async function populateBiathletes() {
  const athleteData = await loadBiathleteData();

  const sourceData = isRelayRaceValue(race.value)
    ? athleteData.countries
    : gender.value === "men"
      ? athleteData.men
      : athleteData.women;

  populatedBiathletes = sourceData;

  for (const biathlete of biathletes) {
    biathlete.list.replaceChildren(); // Clear previous options
    biathlete.name.value = "";

    const options = sourceData.map((item) => {
      const value = isRelayRaceValue(race.value) ? item.country : item.name;
      const label = item.flag;

      const option = document.createElement("option");
      option.value = value;
      option.label = label;
      return option;
    });

    biathlete.list.append(...options);
  }
}

// Gives the code one clean source of truth for the current state
function getReportState() {
  return {
    competition: competition.value,
    venue: venue.value,
    gender: gender.value,
    race: race.value,
    athletes: biathletes.map((athlete) => ({
      name: athlete.name.value,
      shooting: athlete.shooting.map((input) => input.value),
      time: athlete.time.map((input) => input.value),
    })),
  };
}

function getSelectedTop() {
  const selectedTop = [];

  for (const biathlete of biathletes) {
    if (isRelayRaceValue(race.value)) {
      selectedTop.push(populatedBiathletes.find(
        (team) => team.country === biathlete.name.value,
      ));
    } else {
      selectedTop.push(populatedBiathletes.find(
        (athlete) => athlete.name === biathlete.name.value,
      ));
    }
  }

  return selectedTop;
}

function getShootings() {
  const shootings = [];

  for (const biathlete of biathletes) {
    if (race.value == "sprint" || isRelayRaceValue(race.value)) {
      shootings.push(biathlete.shooting[0].value + 
        "+" + biathlete.shooting[1].value);
    } else {
      shootings.push(biathlete.shooting
        .map((input) => input.value)
        .join("+"));
    }
  }

  return shootings;
}

function getTimes() {
  const times = [];

  for (const biathlete of biathletes) {
    times.push(formatTime(biathlete));
  }

  return times;
}

// Error handling
function validateReportState(state) {
  if (!competition.value) {
    alert("Змагання не було вибрано!"); 
    return 1;
  } else if (!gender.value) {
    alert("Гендер не було вибрано!"); 
    return 1;
  } else if (!race.value) {
    alert("Гонку не було вибрано!"); 
    return 1;
  }

  for (const biathlete of biathletes) {
    if (!biathlete.name.value) {
      if (isRelayRaceValue(race.value)) {
        alert(`Країни для ${biathlete.placeNumber} місця не було вибрано!`);
        return 1;
      } else {
        alert(`Біатлоніста для ${biathlete.placeNumber} місця не було вибрано!`);
        return 1;
      }
    }
  }

  const seenNames = new Map();

  for (const [index, biathlete] of biathletes.entries()) {
    const name = biathlete.name.value;

    if (seenNames.has(name)) {
      const firstPlace = seenNames.get(name) + 1;
      alert(`${firstPlace} місце та ${index + 1} місце мають однакового біатлоніста!`);
      return 1;
    }

    seenNames.set(name, index);
  }

  if (getTimeParts(biathletes[0]).minutes === 0) {
    alert("Некоректний переможний час для 1 місця!");
    return 1;
  }

  return 0;
}

function getGenderLabel() {
  const masculineRaces = ["sprint", "masstart", "masstart60"];

  if (gender.value === "men") {
    return masculineRaces.includes(race.value) ? "чоловічого" : "чоловічої";
  }

  if (gender.value === "women") {
    return masculineRaces.includes(race.value) ? "жіночого" : "жіночої";
  }

  return "";
}

function getRaceLabel() {
  const labels = {
    sprint: "спринту",
    pursuit: "гонки переслідування",
    individual: "індивідуальної гонки",
    short: "короткої індивідуальної гонки",
    masstart: "масстарту",
    masstart60: "масстарту-60",
    classic: "класичної естафети",
    mixed: "змішаної естафети",
    single: "одиночної змішаної естафети",
  };

  return labels[race.value];
}

function getResultName(biathlete) {
  return isRelayRaceValue(race.value)
    ? biathlete.country
    : biathlete.name;
}

function buildResultRow(position, biathlete, shooting, time) {
  return `${position}. ${biathlete.flag} ${getResultName(biathlete)} (${shooting}) ${time}`;
}

function generateText() {
  const state = getReportState();
  let error = validateReportState(state);

  if (error === 1) {
    output.value = "";
    return;
  }

  const selectedCompetition = competition.options[competition.selectedIndex].text;
  const selectedVenue = populatedVenues.find(
    (item) => String(item.number) === venue.value,
  );

  const modifiedGender = getGenderLabel();
  const modifiedRace = getRaceLabel();
  const selectedTop = getSelectedTop();
  const shootings = getShootings();
  const times = getTimes();

  const rows = selectedTop
    .map((biathlete, index) => {
      if (!biathlete) return null;
      return buildResultRow(index + 1, biathlete, shootings[index], times[index]);
    })
    .filter(Boolean);
  
  output.value = 
    "🏆 " + selectedCompetition + ", " +
    selectedVenue.number + "-й етап 🏆\n" +
    selectedVenue.flag + " " +
    selectedVenue.stadium + ", " +
    selectedVenue.country + " " +
    selectedVenue.flag + "\nРезультати " +
    modifiedGender + " " +
    modifiedRace + "\n\n" +
    rows.join("\n");
}

competition.addEventListener("change", populateVenues);
gender.addEventListener("change", () => {
  // Reset immediately if no gender was selected
  const shouldResetSelection =
    previousGender === "" ? true :
    !isRelayRaceValue(race.value) && previousGender !== gender.value;
    // resets only when the race isn't a relay but gender changed

  if (shouldResetSelection) {
    clearAthleteRows();
    populateBiathletes();
  }

  previousGender = gender.value;
});
race.addEventListener("change", () => {
  const shouldClear = shouldClearOnRaceChange(previousRaceValue, race.value);

  if (shouldClear) {
    clearAthleteRows();
    populateBiathletes();
  }

  disableShooting();
  addHours();

  for (const athlete of biathletes) {
    for (const input of athlete.shooting) {
      changeShootingFormat(input);
    }
  }

  previousRaceValue = race.value;
});
bindAthleteInputHandlers();

addRowsButton.addEventListener("click", () => {
  const nextPlace = biathletes.length + 1;
  const row = new AthleteResultRow(nextPlace, "dynamic");
  biathletes.push(row);
});

generateTextButton.addEventListener("click", generateText);
