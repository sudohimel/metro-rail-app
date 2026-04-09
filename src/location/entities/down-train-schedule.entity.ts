import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('down_train_schedules')
export class DownTrainSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  trainName: string;

  @Column()
  uttaraNorth: number;

  @Column()
  uttaraCenter: number;

  @Column()
  uttaraSouth: number;

  @Column()
  pallabi: number;

  @Column()
  mirpur11: number;

  @Column()
  mirpur10: number;

  @Column()
  kazipara: number;

  @Column()
  shewrapara: number;

  @Column()
  agargaon: number;

  @Column()
  bijoySarani: number;

  @Column()
  kawranBazar: number;

  @Column()
  shahbagh: number;

  @Column()
  dhakaUniversity: number;

  @Column()
  bangladeshSecretariat: number;

  @Column()
  motijheel: number;

  @Column()
  kamalapur: number;

  @Column()
  status: boolean; // running or not
}
