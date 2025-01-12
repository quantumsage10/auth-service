import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Tenant } from './Tenant'

// db schema for user data

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({ unique: true })
    email: string

    // @Column({select: false}) // it won't select from db, you need to manually select passowrd field whenever needed
    @Column()
    password: string

    @Column()
    role: string

    @ManyToOne(() => Tenant)
    tenant: Tenant
}
