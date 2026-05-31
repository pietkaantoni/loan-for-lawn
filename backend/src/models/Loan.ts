import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import type { User } from "./User.js";

export type LoanStatus = "active" | "paid";

@Entity("loans")
export class Loan {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid")
  user_id!: string;

  @Column("decimal", { precision: 12, scale: 2 })
  amount!: number;

  @Column("decimal", { precision: 5, scale: 2 })
  interest_rate!: number;

  @Column({ type: "varchar", length: 20, default: "active" })
  status!: LoanStatus;

  @Column({ type: "date" })
  due_date!: Date;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne("User", "loans", { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;
}
