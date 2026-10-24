const competition = document.getElementById("competition");
const venue = document.getElementById("venue");
let populatedVenues = [];
const gender = document.getElementById("gender");
const race = document.getElementById("race");
const button = document.getElementById("generate");

async function populateVenues() {
  venue.replaceChildren(); // Clear previous options
  const worldCupVenues = await fetch("world_cup_venues.json").then(response => response.json());
  const ibuCupVenues = await fetch("ibu_cup_venues.json").then(response => response.json());

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
      populatedVenues = worldCupVenues;
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
button.addEventListener("click", generateText);
