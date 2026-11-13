class AthleteResultRow {
  constructor(athleteNumber, mode) {
    this.athleteNumber = athleteNumber;
    this.mode = mode;

    if (this.mode === "existing") {
      this.bindExistingFields();
    } else if (this.mode === "dynamic") {
      this.createNewFields();
    }
  }

  static fromExisting(athleteNumber) {
    return new AthleteResultRow(athleteNumber, "existing");
  }

  static createDynamic(athleteNumber) {
    return new AthleteResultRow(athleteNumber, "dynamic");
  }

  // For existing static fields
  bindExistingFields() {
    this.placeNumber = this.athleteNumber;
    this.name = document.getElementById(`place_${this.athleteNumber}_athlete`);
    this.list = document.getElementById(`athlete_options_${this.athleteNumber}`);
    this.shooting = [
      document.getElementById(`place_${this.athleteNumber}_shot_1`),
      document.getElementById(`place_${this.athleteNumber}_shot_2`),
      document.getElementById(`place_${this.athleteNumber}_shot_3`),
      document.getElementById(`place_${this.athleteNumber}_shot_4`),
    ];
    this.time = [
      document.getElementById(`place_${this.athleteNumber}_time_min`),
      document.getElementById(`place_${this.athleteNumber}_time_sec`),
      document.getElementById(`place_${this.athleteNumber}_time_ms`),
    ];
  }

  // For dynamic generation of new fields
  createNewFields() {
    const row = document.createElement("p");

    const placeInput = document.createElement("input");
    placeInput.type = "text";
    placeInput.inputmode = "numeric";
    placeInput.maxlength = 3;
    placeInput.size = 1;
    placeInput.placeholder = "0";
    placeInput.id = `place_${this.athleteNumber}`;

    const label = document.createElement("label");
    label.setAttribute("for", `place_${this.athleteNumber}_athlete`);
    label.textContent = " місце: ";

    const athleteInput = document.createElement("input");
    athleteInput.type = "text";
    athleteInput.id = `place_${this.athleteNumber}_athlete`;
    athleteInput.setAttribute("list", `athlete_options_${this.athleteNumber}`);

    const datalist = document.createElement("datalist");
    datalist.id = `athlete_options_${this.athleteNumber}`;

    const shootingInputs = [];
    for (let i = 1; i <= 4; i++) {
      const shot = document.createElement("input");
      shot.type = "text";
      shot.id = `place_${this.athleteNumber}_shot_${i}`;
      shot.value = "0";
      shot.size = 1;
      shot.maxLength = 1;
      shootingInputs.push(shot);
    }

    const timeInputs = [];
    ["min", "sec", "ms"].forEach((part) => {
      const label = document.createElement("label");
      label.setAttribute("for", `place_${this.athleteNumber}_time_${part}`);
      label.textContent = part === "min" ? " + " : part === "sec" ? " : " : " . ";
      timeInputs.push(label);

      const input = document.createElement("input");
      input.type = "text";
      input.id = `place_${this.athleteNumber}_time_${part}`;
      input.placeholder = "0";
      input.size = 1;
      input.maxLength = part === "ms" ? 1 : 2;
      timeInputs.push(input);
    });

    const button = document.createElement("button");
    button.id = `delete_rows_${this.athleteNumber}`;
    button.type = "button";
    button.textContent = "Видалити рядок";

    row.append(placeInput, label, athleteInput, datalist, ...shootingInputs, ...timeInputs, button);
    document.body.appendChild(row);

    this.placeNumber = placeInput;
    this.name = athleteInput;
    this.list = datalist;
    this.shooting = shootingInputs;
    this.time = timeInputs;
  }

  deleteCreatedRow() {


  }
}