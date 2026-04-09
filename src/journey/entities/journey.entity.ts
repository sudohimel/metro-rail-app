import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Location } from '../../location/entities/location.entity';

@Entity('journey')
export class Journey {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.journeys)
  @JoinColumn({ name: 'userId' })
  user: User; 

  @Column({ length: 8, unique: true })
  qrCode: string; 

  @Column({ type: 'timestamp', nullable: true })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date; 

  @Column({ type: 'int', nullable: true })
  totalMinutesTraveled: number; 

  @Column({ type: 'int', nullable: true })
  totalDistanceTraveled: number; 

  @Column({ type: 'decimal', nullable: true })
  totalCost: number; 

  @Column({ nullable: true })
  trainName: string; 

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'startStationId' })
  startStation: Location; 

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'endStationId' })
  endStation: Location; 
}
