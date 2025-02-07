import { Brackets, Repository } from 'typeorm'
import { User } from '../entity/User'
import { LimitedUserData, UserData, UserQueryParams } from '../types'
import createHttpError from 'http-errors'
import bcrypt from 'bcryptjs'

export class UserService {
    constructor(private readonly userRepository: Repository<User>) {}

    async create({
        firstName,
        lastName,
        email,
        password,
        role,
        tenantId,
    }: UserData) {
        // whether email present or not in db
        const user = await this.userRepository.findOne({
            where: { email: email },
        })

        if (user) {
            const err = createHttpError(400, 'Email is already exits!')
            throw err
        }

        // Hash the password
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
                tenant: tenantId ? { id: tenantId } : undefined,
            })
        } catch (err) {
            console.log(err)
            const error = createHttpError(
                500,
                'failed to store the data in the database',
            )
            throw error
        }
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({
            where: {
                email,
            },
        })
    }

    async findById(id: number) {
        return await this.userRepository.findOne({
            where: {
                id,
            },
            relations: {
                tenant: true,
            },
        })
    }

    // Pagination - query parameters
    async getAll(validatedQuery: UserQueryParams) {
        const queryBuilder = this.userRepository.createQueryBuilder('user')

        // if q = search query (?page="") in query parameters
        if (validatedQuery.q) {
            // call db - sql saerch query - %text%
            const searchTerm = `%${validatedQuery.q}%`

            // SELECT * FROM user
            // WHERE (CONCAT(user.firstName, ' ', user.lastName) ILIKE '%john%'
            // OR user.email ILIKE '%john%')

            // TypeORM's QueryBuilder - case-insensitive search (ILIKE)
            // "user" is an alias for the users table
            queryBuilder.where(
                new Brackets((querybuild) => {
                    querybuild
                        .where(
                            "CONCAT(user.firstName, ' ', user.lastName) ILike :q",
                            { q: searchTerm },
                        )
                        .orWhere('user.email ILike :q', { q: searchTerm })
                }),
            )
        }

        // if query param has role
        if (validatedQuery.role) {
            queryBuilder.andWhere('user.role = :role', {
                role: validatedQuery.role,
            })
        }

        // Database Call query parameters config
        const result = await queryBuilder
            // alias for tenant table(entity) -  ManyToOne
            .leftJoinAndSelect('user.tenant', 'tenant')
            // no skip on first page 1 - 1 = 0 * 10 = 0 skip record 0
            .skip((validatedQuery.currentPage - 1) * validatedQuery.perPage)
            // limit show 10 records from db per page
            .take(validatedQuery.perPage)
            .orderBy('user.id', 'DESC')
            .getManyAndCount()

        // console.log('Console Query Builder SQL Query', queryBuilder.getSql())

        return result // returning an array
    }

    async update(
        userId: number,
        { firstName, lastName, role }: LimitedUserData,
    ) {
        try {
            return await this.userRepository.update(userId, {
                firstName,
                lastName,
                role,
            })
        } catch (err) {
            console.log(err)
            const error = createHttpError(
                500,
                'Failed to update the user in the database',
            )
            throw error
        }
    }

    async deleteById(userId: number) {
        return await this.userRepository.delete(userId)
    }
}
