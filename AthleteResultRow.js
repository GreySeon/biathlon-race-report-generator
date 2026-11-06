class AthleteResultRow {
  constructor(placeNumber, mode) {
    this.placeNumber = placeNumber;
    this.mode = mode;

    if (this.mode === "existing") {
      this.bindExistingFields();
    } else if (this.mode === "dynamic") {
      this.createNewFields();
    }
  }

  static fromExisting(placeNumber) {
    return new AthleteResultRow(placeNumber, "existing");
  }

  static createDynamic(placeNumber) {
    return new AthleteResultRow(placeNumber, "dynamic");
  }

  // For existing static fields
  bindExistingFields() {
    this.name = document.getElementById(`place_${this.placeNumber}_athlete`);
    this.list = document.getElementById(`athlete_options_${this.placeNumber}`);
    this.shooting = [
      document.getElementById(`place_${this.placeNumber}_shot_1`),
      document.getElementById(`place_${this.placeNumber}_shot_2`),
      document.getElementById(`place_${this.placeNumber}_shot_3`),
      document.getElementById(`place_${this.placeNumber}_shot_4`),
    ];
    this.time = [
      document.getElementById(`place_${this.placeNumber}_time_min`),
      document.getElementById(`place_${this.placeNumber}_time_sec`),
      document.getElementById(`place_${this.placeNumber}_time_ms`),
    ];
  }

  // For dynamic generation of new fields
  createNewFields() {}

  clear() {}
}