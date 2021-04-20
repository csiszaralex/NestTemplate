import { IsNotEmpty, Matches } from 'class-validator';
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

  @Column({ unique: true })
  @IsNotEmpty()
  phoneNumber: string;

  @Column()
  @IsNotEmpty()
  salt: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ default: 0 })
  role: number;
}
