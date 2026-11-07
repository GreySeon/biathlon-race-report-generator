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

const button = document.getElementById("generate");

// Race helpers
function isRelayRaceSelected() {
  return isRelayRaceValue(race.value);
}

function isRelayRaceValue(value) {
  return (
    value === "classic" ||
    value === "mixed" ||
    value === "single"
  );
}

function shouldClearOnRaceChange(previousValue, nextValue) {
  return isRelayRaceValue(previousValue) !== isRelayRaceValue(nextValue);
}

function clearAthleteRows() {
  for (const athlete of biathletes) {
    athlete.list.replaceChildren();
    athlete.name.value = "";
  }
}

function isWinnerHourRace() {
  return race.value === "classic" || race.value === "mixed";
}

// Shooting helpers
function getShootingRules() {
  if (isRelayRaceSelected()) {
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

  if (!isRelayRaceSelected()) {
    value = value.replace(/[6-9]/g, "").slice(0, 1);
  }

  input.value = value;
}

function disableShooting() {
  for (const biathlete of biathletes) {
    const shouldDisableLastShots =
      isRelayRaceSelected() || race.value === "sprint";
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

function formatTime(biathlete) {
  const { minutes, seconds, tenths } = getTimeParts(biathlete);

  if (minutes === 0 && seconds === 0 && tenths === 0) {
    return "0.0";
  }

  if (minutes === 0) {
    return `${seconds}.${tenths}`;
  }

  if (isWinnerHourRace() && biathlete == biathletes[0]) {
    return `1:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}.${tenths}`;
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

  const sourceData = isRelayRaceSelected()
    ? athleteData.countries
    : gender.value === "men"
      ? athleteData.men
      : athleteData.women;

  populatedBiathletes = sourceData;

  for (const biathlete of biathletes) {
    biathlete.list.replaceChildren(); // Clear previous options
    biathlete.name.value = "";

    const options = sourceData.map((item) => {
      const value = isRelayRaceSelected() ? item.country : item.name;
      const label = item.flag;

      const option = document.createElement("option");
      option.value = value;
      option.label = label;
      return option;
    });

    biathlete.list.append(...options);
  }
}

function generateText() {
  const selectedCompetition =
    competition.options[competition.selectedIndex].text;
  const selectedVenue = populatedVenues.find(
    (item) => String(item.number) === venue.value,
  );
  const selectedGender = gender.options[gender.selectedIndex].text;
  let modifiedGender = "";
  const selectedRace = race.options[race.selectedIndex].text;
  let modifiedRace = "";

  const selectedTop = [];
  for (let i = 0; i < 6; i++) {
    if (
      race.value == "classic" ||
      race.value == "mixed" ||
      race.value == "single"
    ) {
      selectedTop[i] = populatedBiathletes.find(
        (team) => team.country === biathletes[i].name.value,
      );
    } else {
      selectedTop[i] = populatedBiathletes.find(
        (athlete) => athlete.name === biathletes[i].name.value,
      );
    }
  }

  const shootings = [];
  for (let i = 0; i < 6; i++) {
    if (
      race.value == "sprint" ||
      race.value == "classic" ||
      race.value == "mixed" ||
      race.value == "single"
    ) {
      shootings[i] =
        biathletes[i].shooting[0].value + "+" + biathletes[i].shooting[1].value;
    } else {
      shootings[i] = biathletes[i].shooting
        .map((input) => input.value)
        .join("+");
    }
  }

  const times = [];
  for (let i = 0; i < 6; i++) {
    times[i] = formatTime(biathletes[i]);
  }

  const errorText = document.getElementById("error_text");
  errorText.value = "";

  // Error handling
  if (competition.value === "") {
    errorText.value = "Змагання не було вибрано!";
    output.value = "";
    return;
  } else if (gender.value === "") {
    errorText.value = "Гендер не було вибрано!";
    output.value = "";
    return;
  } else if (race.value === "") {
    errorText.value = "Гонку не було вибрано!";
    output.value = "";
    return;
  } else if (biathletes[0].name.value === "") {
    errorText.value = "Біатлоніста для 1 місця не було вибрано!";
    output.value = "";
    return;
  } else if (biathletes[1].name.value === "") {
    errorText.value = "Біатлоніста для 2 місця не було вибрано!";
    output.value = "";
    return;
  } else if (biathletes[2].name.value === "") {
    errorText.value = "Біатлоніста для 3 місця не було вибрано!";
    output.value = "";
    return;
  } else if (biathletes[3].name.value === "") {
    errorText.value = "Біатлоніста для 4 місця не було вибрано!";
    output.value = "";
    return;
  } else if (biathletes[4].name.value === "") {
    errorText.value = "Біатлоніста для 5 місця не було вибрано!";
    output.value = "";
    return;
  } else if (biathletes[5].name.value === "") {
    errorText.value = "Біатлоніста для 6 місця не було вибрано!";
    output.value = "";
    return;
  } else if (times[0] === "0.0") {
    errorText.value = "Переможний час для 1 місця не було встановлено!";
    output.value = "";
    return;
  }

  for (let i = 0; i < biathletes.length; i++) {
    for (let j = i + 1; j < biathletes.length; j++) {
      if (biathletes[i].name.value == biathletes[j].name.value) {
        errorText.value = `${i + 1} місце та ${j + 1} місце мають однакового біатлоніста!`;
        output.value = "";
        return;
      }
    }
  }

  // Різні відмінювання слова
  if (
    gender.value == "men" &&
    (race.value == "sprint" ||
      race.value == "masstart" ||
      race.value == "masstart60")
  ) {
    modifiedGender = "чоловічого";
  } else if (
    gender.value == "men" &&
    (race.value == "pursuit" ||
      race.value == "individual" ||
      race.value == "short" ||
      race.value == "classic" ||
      race.value == "mixed" ||
      race.value == "single")
  ) {
    modifiedGender = "чоловічої";
  } else if (
    gender.value == "women" &&
    (race.value == "sprint" ||
      race.value == "masstart" ||
      race.value == "masstart60")
  ) {
    modifiedGender = "жіночого";
  } else if (
    gender.value == "women" &&
    (race.value == "pursuit" ||
      race.value == "individual" ||
      race.value == "short" ||
      race.value == "classic" ||
      race.value == "mixed" ||
      race.value == "single")
  ) {
    modifiedGender = "жіночої";
  }

  switch (race.value) {
    case "sprint":
      modifiedRace = "спринту";
      break;
    case "pursuit":
      modifiedRace = "гонки переслідування";
      break;
    case "individual":
      modifiedRace = "індивідуальної гонки";
      break;
    case "short":
      modifiedRace = "короткої індивідуальної гонки";
      break;
    case "masstart":
      modifiedRace = "масстарту";
      break;
    case "masstart60":
      modifiedRace = "масстарту-60";
      break;
    case "classic":
      modifiedRace = "класичної естафети";
      break;
    case "mixed":
      modifiedRace = "змішаної естафети";
      break;
    case "single":
      modifiedRace = "одиночної змішаної естафети";
      break;
    default:
      break;
  }

  if (
    race.value == "classic" ||
    race.value == "mixed" ||
    race.value == "single"
  ) {
    output.value =
      "🏆 " +
      selectedCompetition +
      ", " +
      selectedVenue.number +
      "-й етап 🏆\n" +
      selectedVenue.flag +
      " " +
      selectedVenue.stadium +
      ", " +
      selectedVenue.country +
      " " +
      selectedVenue.flag +
      "\nРезультати " +
      modifiedGender +
      " " +
      modifiedRace +
      "\n\n1. " +
      selectedTop[0].flag +
      " " +
      selectedTop[0].country +
      " (" +
      shootings[0] +
      ") " +
      times[0] +
      "\n2. " +
      selectedTop[1].flag +
      " " +
      selectedTop[1].country +
      " (" +
      shootings[1] +
      ") +" +
      times[1] +
      "\n3. " +
      selectedTop[2].flag +
      " " +
      selectedTop[2].country +
      " (" +
      shootings[2] +
      ") +" +
      times[2] +
      "\n4. " +
      selectedTop[3].flag +
      " " +
      selectedTop[3].country +
      " (" +
      shootings[3] +
      ") +" +
      times[3] +
      "\n5. " +
      selectedTop[4].flag +
      " " +
      selectedTop[4].country +
      " (" +
      shootings[4] +
      ") +" +
      times[4] +
      "\n6. " +
      selectedTop[5].flag +
      " " +
      selectedTop[5].country +
      " (" +
      shootings[5] +
      ") +" +
      times[5];
  } else {
    output.value =
      "🏆 " +
      selectedCompetition +
      ", " +
      selectedVenue.number +
      "-й етап 🏆\n" +
      selectedVenue.flag +
      " " +
      selectedVenue.stadium +
      ", " +
      selectedVenue.country +
      " " +
      selectedVenue.flag +
      "\nРезультати " +
      modifiedGender +
      " " +
      modifiedRace +
      "\n\n1. " +
      selectedTop[0].flag +
      " " +
      selectedTop[0].name +
      " (" +
      shootings[0] +
      ") " +
      times[0] +
      "\n2. " +
      selectedTop[1].flag +
      " " +
      selectedTop[1].name +
      " (" +
      shootings[1] +
      ") +" +
      times[1] +
      "\n3. " +
      selectedTop[2].flag +
      " " +
      selectedTop[2].name +
      " (" +
      shootings[2] +
      ") +" +
      times[2] +
      "\n4. " +
      selectedTop[3].flag +
      " " +
      selectedTop[3].name +
      " (" +
      shootings[3] +
      ") +" +
      times[3] +
      "\n5. " +
      selectedTop[4].flag +
      " " +
      selectedTop[4].name +
      " (" +
      shootings[4] +
      ") +" +
      times[4] +
      "\n6. " +
      selectedTop[5].flag +
      " " +
      selectedTop[5].name +
      " (" +
      shootings[5] +
      ") +" +
      times[5];
  }
}

competition.addEventListener("change", populateVenues);
gender.addEventListener("change", () => {
  const shouldResetSelection =
    previousGender === "" ? true :
    !isRelayRaceSelected() && previousGender !== gender.value;

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

button.addEventListener("click", generateText);
