const competition = document.getElementById("competition");
const venue = document.getElementById("venue");
let populatedVenues = [];
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
  const competitionText = competition.options[competition.selectedIndex].text;
  const selectedVenue = populatedVenues.find(
    item => String(item.number) === venue.value
  );
  output.value =
    "🏆 " +
    competitionText +
    ", " +
    selectedVenue.number +
    "-й етап 🏆\n" +
    selectedVenue.flag +
    " " +
    selectedVenue.stadium +
    ", " +
    selectedVenue.country +
    " " +
    selectedVenue.flag;
}

competition.addEventListener("change", populateVenues);
button.addEventListener("click", generateText);
