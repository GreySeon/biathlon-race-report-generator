const competition = document.getElementById("competition");
const venue = document.getElementById("venue");
let populatedVenues = [];
const gender = document.getElementById("gender");
const race = document.getElementById("race");
const biathletes = [
  {
    name: document.getElementById("1stplace"),
    list: document.getElementById("biathletes1"),
    shooting: [
      document.getElementById("1stshooting1"),
      document.getElementById("2ndshooting1"),
      document.getElementById("3rdshooting1"),
      document.getElementById("4thshooting1"),
    ],
    time: [
      document.getElementById("winningmins"),
      document.getElementById("winningsecs"),
      document.getElementById("winningmils"),
    ],
  },
  {
    name: document.getElementById("2ndplace"),
    list: document.getElementById("biathletes2"),
    shooting: [
      document.getElementById("1stshooting2"),
      document.getElementById("2ndshooting2"),
      document.getElementById("3rdshooting2"),
      document.getElementById("4thshooting2"),
    ],
    time: [
      document.getElementById("minsbehind2"),
      document.getElementById("secsbehind2"),
      document.getElementById("milsbehind2"),
    ],
  },
  {
    name: document.getElementById("3rdplace"),
    list: document.getElementById("biathletes3"),
    shooting: [
      document.getElementById("1stshooting3"),
      document.getElementById("2ndshooting3"),
      document.getElementById("3rdshooting3"),
      document.getElementById("4thshooting3"),
    ],
    time: [
      document.getElementById("minsbehind3"),
      document.getElementById("secsbehind3"),
      document.getElementById("milsbehind3"),
    ],
  },
  {
    name: document.getElementById("4thplace"),
    list: document.getElementById("biathletes4"),
    shooting: [
      document.getElementById("1stshooting4"),
      document.getElementById("2ndshooting4"),
      document.getElementById("3rdshooting4"),
      document.getElementById("4thshooting4"),
    ],
    time: [
      document.getElementById("minsbehind4"),
      document.getElementById("secsbehind4"),
      document.getElementById("milsbehind4"),
    ],
  },
  {
    name: document.getElementById("5thplace"),
    list: document.getElementById("biathletes5"),
    shooting: [
      document.getElementById("1stshooting5"),
      document.getElementById("2ndshooting5"),
      document.getElementById("3rdshooting5"),
      document.getElementById("4thshooting5"),
    ],
    time: [
      document.getElementById("minsbehind5"),
      document.getElementById("secsbehind5"),
      document.getElementById("milsbehind5"),
    ],
  },
  {
    name: document.getElementById("6thplace"),
    list: document.getElementById("biathletes6"),
    shooting: [
      document.getElementById("1stshooting6"),
      document.getElementById("2ndshooting6"),
      document.getElementById("3rdshooting6"),
      document.getElementById("4thshooting6"),
    ],
    time: [
      document.getElementById("minsbehind6"),
      document.getElementById("secsbehind6"),
      document.getElementById("milsbehind6"),
    ],
  },
];
let populatedBiathletes = [];
const button = document.getElementById("generate");

async function populateVenues() {
  venue.replaceChildren(); // Clear previous options
  const worldCupVenues = await fetch("JSON/world_cup_venues.json").then(response => response.json());
  const ibuCupVenues = await fetch("JSON/ibu_cup_venues.json").then(response => response.json());

  switch (competition.value) {
    case "world_cup":
      populatedVenues = worldCupVenues;
      for (let i = 0; i < worldCupVenues.length; i++) {
        const option = new Option(
          worldCupVenues[i].number +
            ". " +
            worldCupVenues[i].flag +
            " " +
            worldCupVenues[i].stadium,
          worldCupVenues[i].number
        );
        document.getElementById("venue").add(option);
      }
      break;
    case "ibu_cup":
      populatedVenues = ibuCupVenues;
      for (let i = 0; i < ibuCupVenues.length; i++) {
        const option = new Option(
          ibuCupVenues[i].number +
            ". " +
            ibuCupVenues[i].flag +
            " " +
            ibuCupVenues[i].stadium,
          ibuCupVenues[i].number
        );
        document.getElementById("venue").add(option);
      }
      break;
  }
}

function disableShooting() {
  for (let i = 0; i < biathletes.length; i++) {
    if (
      race.value == "sprint"
    ) {
      biathletes[i].shooting[2].disabled = true;
      biathletes[i].shooting[3].disabled = true;
    } else {
      biathletes[i].shooting[2].disabled = false;
      biathletes[i].shooting[3].disabled = false;
    }
  }
}

async function populateBiathletes() {
  for (let i = 0; i < biathletes.length; i++) {
    biathletes[i].list.replaceChildren(); // Clear previous options
    biathletes[i].name.value = "";
    const men = await fetch("JSON/men_biathletes.json").then((response) =>
      response.json(),
    );
    const women = await fetch("JSON/women_biathletes.json").then((response) =>
      response.json(),
    );

    switch (gender.value) {
      case "men":
        populatedBiathletes = men;
        for (let j = 0; j < men.length; j++) {
          const option = document.createElement("option");
          option.value = men[j].name;
          option.label = men[j].flag;
          biathletes[i].list.append(option);
        }
        break;
      case "women":
        populatedBiathletes = women;
        for (let j = 0; j < women.length; j++) {
          const option = document.createElement("option");
          option.value = women[j].name; // це значення потрапить у поле вводу
          option.label = women[j].flag; // прапор у підказці
          biathletes[i].list.append(option);
        }
        break;
    }
  }
}

function formatTime(biathlete) {
  const [minutes, seconds, tenths] = biathlete.time.map(
    (input) => input.value || "0",
  );

  const minuteValue = Number(minutes);
  const minutePart = minuteValue === 0 ? "" : `${minuteValue}`;
  const secondsValue = Number(seconds);
  const secondsPart = secondsValue === 0 ? "" : `${secondsValue}`;

  if (minuteValue === 0 && secondsValue === 0 && Number(tenths) === 0) {
    return "0.0";
  }

  if (minuteValue === 0) {
    if (secondsValue <= 9) {
      return `${secondsPart}.${tenths}`;
    }

    return `${secondsPart.padStart(2, "0")}.${tenths}`;
  }

  return `${minutePart}:${secondsPart.padStart(2, "0")}.${tenths}`;
}

function generateText() {
  const selectedCompetition = competition.options[competition.selectedIndex].text;
  const selectedVenue = populatedVenues.find(
    item => String(item.number) === venue.value
  );
  const selectedGender = gender.options[gender.selectedIndex].text;
  let modifiedGender = "";
  const selectedRace = race.options[race.selectedIndex].text;
  let modifiedRace = "";

  const selectedTop = [];
  for (let i = 0; i < 6; i++) {
      selectedTop[i] = populatedBiathletes.find(
        (athlete) => athlete.name === biathletes[i].name.value,
      );
  }

  const shootings = [];
  for (let i = 0; i < 6; i++) {
    shootings[i] = biathletes[i].shooting.map((input) => input.value).join("+");
  }

  const times = [];
  for (let i = 0; i < 6; i++) {
    times[i] = formatTime(biathletes[i]);
  }

  const errorText = document.getElementById("errorText");
  errorText.value = "";

  // Error handling
  if (competition.value === "empty") {
    errorText.value = "Змагання не було вибрано!";
    output.value = "";
    return;
  } else if (gender.value === "empty") {
    errorText.value = "Гендер не було вибрано!";
    output.value = "";
    return;
  } else if (race.value === "empty") {
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
  }

  output.value =
    "🏆 " + selectedCompetition + ", " + selectedVenue.number + "-й етап 🏆\n" +
    selectedVenue.flag + " " + selectedVenue.stadium + ", " + selectedVenue.country + " " + selectedVenue.flag +
    "\nРезультати " + modifiedGender + " " + modifiedRace +
    "\n\n1. " + selectedTop[0].flag + " " + selectedTop[0].name + " (" + shootings[0] + ") " + times[0] +
    "\n2. " + selectedTop[1].flag + " " + selectedTop[1].name + " (" + shootings[1] + ") +" + times[1] +
    "\n3. " + selectedTop[2].flag + " " + selectedTop[2].name + " (" + shootings[2] + ") +" + times[2] +
    "\n4. " + selectedTop[3].flag + " " + selectedTop[3].name + " (" + shootings[3] + ") +" + times[3] +
    "\n5. " + selectedTop[4].flag + " " + selectedTop[4].name + " (" + shootings[4] + ") +" + times[4] +
    "\n6. " + selectedTop[5].flag + " " + selectedTop[5].name + " (" + shootings[5] + ") +" + times[5];
}

competition.addEventListener("change", populateVenues);
gender.addEventListener("change", populateBiathletes);
race.addEventListener("change", disableShooting);

// For shooting
for (let i = 0; i < biathletes.length; i++) {
  for (let j = 0; j < biathletes[i].shooting.length; j++) {
    biathletes[i].shooting[j].addEventListener("input", (event) => {
      event.currentTarget.value = event.currentTarget.value
        .replace(/[^0-5]/g, "")
        .slice(0, 1);
    });
  }
}

// For times
for (let i = 0; i < biathletes.length; i++) {
  for (let j = 0; j < biathletes[i].time.length; j++) {
    biathletes[i].time[j].addEventListener("input", (event) => {
      const input = event.currentTarget;
      let value = input.value.replace(/\D/g, "").slice(0, 2);

      if (Number(value) > 59) {
        value = value.slice(0, 1);
      }

      input.value = value;
    });
  }
}

button.addEventListener("click", generateText);
