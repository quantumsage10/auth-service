import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { User } from './User'

// db schema for refresh token

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'timestamp' })
    expiresAt: Date

    @ManyToOne(() => User)
    user: User

    @UpdateDateColumn()
    updatedAt: number

    @CreateDateColumn()
    createdAt: number
}
