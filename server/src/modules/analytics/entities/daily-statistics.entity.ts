import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('daily_statistics')
export class DailyStatistics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', unique: true })
  date: string;

  @Column({ default: 0 })
  uniqueVisits: number;
}
