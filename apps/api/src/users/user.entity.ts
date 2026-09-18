import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from '../clients/client.entity';
import { Invoice } from '../invoices/invoice.entity';
@Entity('users') export class User {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ length: 120 }) name!: string;
  @Column({ unique: true, length: 160 }) email!: string;
  @Column({ name: 'password_hash' }) passwordHash!: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt!: Date;
  @OneToMany(() => Client, c => c.user) clients!: Client[];
  @OneToMany(() => Invoice, i => i.user) invoices!: Invoice[];
}
