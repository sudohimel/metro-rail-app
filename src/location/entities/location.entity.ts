import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  stationName: string;

  @Column()
  fare: number;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ nullable: true })
  time: number; // Time in minutes

  @Column({ nullable: true })
  distance: number; // Distance in kilometers
}
