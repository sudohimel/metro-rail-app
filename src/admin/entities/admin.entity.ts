import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AdminServiceTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startTime: string;

  @Column()
  endTime: string;
}
