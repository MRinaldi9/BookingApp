export interface Booking {
  id: string;
  placeId: string;
  userId: string;
  placeImage: string;
  firstName: string;
  lastName: string;
  placeTitle: string;
  guestNumber: number;
  bookedFrom: Date;
  bookedTo: Date;
}
