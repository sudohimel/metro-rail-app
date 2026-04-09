import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('up_train_schedules')
export class UpTrainSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  trainName: string;

  @Column()
  kamalapur: number;

  @Column()
  motijheel: number;

  @Column()
  bangladeshSecretariat: number;

  @Column()
  dhakaUniversity: number;

  @Column()
  shahbagh: number;

  @Column()
  kawranBazar: number;

  @Column()
  farmgate: number;

  @Column()
  bijoySarani: number;

  @Column()
  agargaon: number;

  @Column()
  shewrapara: number;

  @Column()
  kazipara: number;

  @Column()
  mirpur10: number;

  @Column()
  mirpur11: number;

  @Column()
  pallabi: number;

  @Column()
  uttaraSouth: number;

  @Column()
  uttaraCenter: number;

  @Column()
  uttaraNorth: number;

  @Column()
  status: boolean; // running or not
}
