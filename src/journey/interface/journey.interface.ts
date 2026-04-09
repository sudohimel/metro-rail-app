export interface CreateJourney {
  userId: number;
  startStationId: number;
  endStationId: number;
}

export interface StartJourney {
  userId: number;
  qrCode: string;
}

export interface EndJourney {
  userId: number;
  qrCode: string;
}

export interface EndJourneyResponse {
  fullName: string; // User's full name
  phoneNumber: string; // User's phone number
  startTime: Date; // Journey start time
  endTime: Date; // Journey end time
  totalMinutesTraveled: number; // Total time spent traveling (in minutes)
  totalDistanceTraveled: number; // Total distance covered (in kilometers)
  totalCost: number; // Total cost of the journey
  trainName: string | null; // Name of the train used for the journey
  message: string; // Response message
}
