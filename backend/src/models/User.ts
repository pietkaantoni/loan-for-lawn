import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import type { Loan } from "./Loan.js";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, length: 50 })
  username!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ length: 255 })
  password_hash!: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany("Loan", "user")
  loans!: Loan[];
}
