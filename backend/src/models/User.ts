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

  @Column("varchar", { unique: true, length: 50 })
  username!: string;

  @Column("varchar", { unique: true, length: 255 })
  email!: string;

  @Column("varchar", { length: 255 })
  password_hash!: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany("Loan", "user")
  loans!: Loan[];
}
