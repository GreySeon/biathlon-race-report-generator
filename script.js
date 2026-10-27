const competition = document.getElementById("competition");
const venue = document.getElementById("venue");
let populatedVenues = [];
const gender = document.getElementById("gender");
const race = document.getElementById("race");
const biathletes = [
  {
    name: document.getElementById("biathletes1"),
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
    name: document.getElementById("biathletes2"),
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
    name: document.getElementById("biathletes3"),
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
    name: document.getElementById("biathletes4"),
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
    name: document.getElementById("biathletes5"),
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
    name: document.getElementById("biathletes6"),
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
  for (i = 0; i < biathletes.length; i++) {
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
  for (i = 0; i < biathletes.length; i++) {
    biathletes[i].name.replaceChildren(); // Clear previous options
    const men = await fetch("JSON/men_biathletes.json").then((response) =>
      response.json(),
    );
    const women = await fetch("JSON/women_biathletes.json").then((response) =>
      response.json(),
    );

    switch (gender.value) {
      case "men":
        for (let j = 0; j < men.length; j++) {
          const option = new Option(men[j].flag + " " + men[j].name);
          biathletes[i].name.append(option);
        }
        break;
      case "women":
        for (let j = 0; j < women.length; j++) {
          const option = document.createElement("option");
          option.value = women[j].name; // це значення потрапить у поле вводу
          option.label = women[j].flag; // прапор у підказці
          biathletes[i].name.append(option);
        }
        break;
    }
  }
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
    modifiedRace;
}

competition.addEventListener("change", populateVenues);
gender.addEventListener("change", populateBiathletes);
race.addEventListener("change", disableShooting);

// For shooting
for (i = 0; i < biathletes.length; i++) {
  for (j = 0; j < biathletes[i].shooting.length; j++) {
    biathletes[i].shooting[j].addEventListener("input", (event) => {
      event.currentTarget.value = event.currentTarget.value
        .replace(/[^0-5]/g, "")
        .slice(0, 1);
    });
  }
}

// For times
for (i = 0; i < biathletes.length; i++) {
  for (j = 0; j < biathletes[i].time.length; j++) {
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
