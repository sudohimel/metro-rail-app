export interface ILocation {
  id: number;
  stationName: string;
  fare: number;
  isAvailable: boolean;
  time?: number;
  distance?: number;
}

export interface ITrainSchedule {
  id: number;
  trainName: string; // Updated to match the DTO structure
  kamalapur?: number;
  motijheel?: number;
  bangladeshSecretariat?: number;
  dhakaUniversity?: number;
  shahbagh?: number;
  kawranBazar?: number;
  farmgate?: number;
  bijoySarani?: number;
  agargaon?: number;
  shewrapara?: number;
  kazipara?: number;
  mirpur10?: number;
  mirpur11?: number;
  pallabi?: number;
  uttaraSouth?: number;
  uttaraCenter?: number;
  uttaraNorth?: number;
  status: boolean; // status as a boolean to indicate running or not
}
