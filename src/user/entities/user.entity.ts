import { Journey } from 'src/journey/entities/journey.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IUser } from '../interface/user.interface';

@Entity('users')
export class User implements IUser {
  createdAt: Date;
  updatedAt: Date;
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ unique: true, length: 9 })
  nidNumber: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  photoUrl?: string;

  @OneToMany(() => Journey, (journey) => journey.user, { cascade: true })
  journeys: Journey[];
}
