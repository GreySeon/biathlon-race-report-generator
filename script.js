const competition = document.getElementById("competition");
const venue = document.getElementById("venue");

async function populateVenues() {
  venue.replaceChildren(); // Clear previous options
  const worldCupVenues = await fetch("world_cup_venues.json").then(response => response.json());
  const ibuCupVenues = await fetch("ibu_cup_venues.json").then(response => response.json());

  switch (competition.value) {
    case "world_cup":
      for (let i = 0; i < worldCupVenues.length; i++) {
        const option = new Option(
          worldCupVenues[i].number +
          ". " +
          worldCupVenues[i].flag +
          " " +
          worldCupVenues[i].stadium
        );
        document.getElementById("venue").add(option);
      }
      break;
    case "ibu_cup":
      for (let i = 0; i < ibuCupVenues.length; i++) {
        const option = new Option(
          ibuCupVenues[i].number +
          ". " +
          ibuCupVenues[i].flag +
          " " +
          ibuCupVenues[i].stadium
        );
        document.getElementById("venue").add(option);
      }
      break;
  }
}

competition.addEventListener("change", populateVenues);
