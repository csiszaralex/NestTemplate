import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  fullName: string;

  @Column({ unique: true })
  @IsNotEmpty()
  email: string;

  @Column({ unique: true, default: null })
  phoneNumber: string;

  @Column()
  @IsNotEmpty()
  salt: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ default: 0 })
  role: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  signedIn: Date;
}
