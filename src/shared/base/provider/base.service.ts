import { BaseService } from '../../interfaces/base-service.interface';
import { EasyCookBaseEntity } from '../entity/base.entity';
import { DeleteResult, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { ErrorResponse } from '../../models/error-response';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Token } from 'src/users/interfaces/token.interface';

/**
 * @async toute méthode est asynchrone.
 * @requires T, l'entité qui est la base du service.
 * @implements les 4 méthodes CRUD de bases.
 */
export abstract class EasyCookBaseService<T extends EasyCookBaseEntity> implements BaseService<T> {
    /**
     * Tableau d'erreurs, comportant chacune des erreurs de la requête, ainsi que le nom du champ qui pose problème.
     * Une erreur 500 est renvoyée par TypeORM si des champs Non Nullable sont null
     */
    errors: ErrorResponse[] = [];

    constructor(private readonly repository: Repository<T>) {}

    /**
     * Pour vérifier si la création peut-être faite ou non.
     * Permet d'intégrer la business logic.
     */
    abstract canCreate(dto: T | any, user?: Token): boolean;

    /**
     * ! Il faudra override cette méthode pour les entités qui ont des relations avec les autres entités et qui ne peuvent pas être créée sans.
     * ! Exemple : Une recette ne peut être créée sans étapes ou ingrédients. Il faut donc insérer ces ingrédients et/ou les récupérer, de même pour
     * ! les étapes.
     * ! Ce use case peut être appliquée à toutes les méthodes CRUD
     * @param dto l'objet à insérer
     * @param user [optional] certaines requêtes peuvent être faites par un type d'utilisateur uniquement.
     * @returns l'objet inséré ou une erreur
     */
    async create(dto: T | T[] | any, user?: Token): Promise<T | HttpException> {
        try {
            if (this.canCreate(dto, user)) {
                return await this.repository.save(dto);
            } else {
                throw new HttpException({ errors: this.errors }, HttpStatus.BAD_REQUEST);
            }
        } catch (err) {
            throw err;
        }
    }

    /**
     * Permet de vérifier si on peut récupérer l'élément ou les éléments.
     * @param user l'utilisateur connecté si la requête nécessite une authentification
     */
    abstract canAccessToAll(user?: Token): boolean;

    /**
     * ! Il faudra override cette méthode pour les entités qui ont des relations avec les autres entités.
     * ! Exemple : Une recette ne peut être créée sans étapes ou ingrédients. Il faut donc insérer ces ingrédients et/ou les récupérer, de même pour
     * ! les étapes.
     * ! Ce use case peut être appliquée à toutes les méthodes CRUD
     *
     * @param user [optional] certaines requêtes peuvent être faites par un type d'utilisateur uniquement.
     * @returns liste de toutes les entités ou une liste d'erreurs
     */
    async findAll(user?: Token): Promise<T[] | HttpException> {
        try {
            if (this.canAccessToAll(user)) {
                return await this.repository.find();
            } else {
                throw new HttpException({ errors: this.errors }, HttpStatus.BAD_REQUEST);
            }
        } catch (err) {
            throw err;
        }
    }

    /**
     * Pour vérifier si l'accès peut-être accordé.
     * Permet d'intégrer la business logic.
     * @param user l'utilisateur connecté si la requête nécessite une authentification
     */
    abstract canAccess(user?: Token): boolean;

    /**
     * ! Il faudra override cette méthode pour les entités qui ont des relations avec les autres entités.
     * ! Exemple : Une recette ne peut être créée sans étapes ou ingrédients. Il faut donc insérer ces ingrédients et/ou les récupérer, de même pour
     * ! les étapes.
     * ! Ce use case peut être appliquée à toutes les méthodes CRUD
     * @param id l'id de l'entité à récupérer
     * @param user [optional] certaines requêtes peuvent être faites par un type d'utilisateur uniquement.
     * @returns une entité précise
     */
    async findOne(id: string | number, user?: Token): Promise<T | HttpException> {
        try {
            if (this.canAccess(user)) {
                return await this.repository.findOne({ where: { id: id } as FindOptionsWhere<unknown> });
            } else {
                //                 throw new HttpException({ errors: this.errors }, HttpStatus.BAD_REQUEST);

                throw new HttpException({ errors: this.errors }, HttpStatus.BAD_REQUEST);
            }
        } catch (err) {
            throw err;
        }
    }

    /**
     * Pour vérifier si la modification peut-être accordé.
     * Permet d'intégrer la business logic.
     * @param user l'utilisateur connecté si la requête nécessite une authentification
     */
    abstract canUpdate(user?: Token): boolean;

    /**
     * ! Il faudra override cette méthode pour les entités qui ont des relations avec les autres entités.
     * ! Exemple : Une recette ne peut être créée sans étapes ou ingrédients. Il faut donc insérer ces ingrédients et/ou les récupérer, de même pour
     * ! les étapes.
     * ! Ce use case peut être appliquée à toutes les méthodes CRUD
     * @param id l'id de l'entité à modifier
     * @param user [optional] certaines requêtes peuvent être faites par un type d'utilisateur uniquement.
     * @returns la modification
     */
    async update(id: string, dto: any, user?: Token): Promise<UpdateResult | HttpException> {
        try {
            if (this.canUpdate(user)) {
                return await this.repository.update(id, dto);
            } else {
                throw new HttpException({ errors: this.errors }, HttpStatus.BAD_REQUEST);
            }
        } catch (err) {
            throw err;
        }
    }

    /**
     * Pour vérifier si la suppression peut-être accordé.
     * Permet d'intégrer la business logic.
     * @param user l'utilisateur connecté si la requête nécessite une authentification
     */
    abstract canDelete(user?: Token): boolean;

    /**
     * ! Il faudra override cette méthode pour les entités qui ont des relations avec les autres entités.
     * ! Exemple : Une recette ne peut être créée sans étapes ou ingrédients. Il faut donc insérer ces ingrédients et/ou les récupérer, de même pour
     * ! les étapes.
     * ! Ce use case peut être appliquée à toutes les méthodes CRUD
     * @param id l'id de l'entité à supprimer
     * @param user [optional] certaines requêtes peuvent être faites par un type d'utilisateur uniquement.
     * @returns la suppression
     */
    async delete(id: string, user?: Token): Promise<DeleteResult | HttpException> {
        try {
            if (this.canDelete(user)) {
                return await this.repository.delete(id);
            } else {
                throw new HttpException({ errors: this.errors }, HttpStatus.BAD_REQUEST);
            }
        } catch (err) {
            throw err;
        }
    }

    // async getItems(user?: User, page: number, number: number): Promise<T | HttpException> {
    //     try {
    //     } catch (err) {}
    // }

    /**
     * Créer une nouvelle erreur dans le tableau des erreurs
     * @param message Le message de l'erreur
     * @param source La source de l'erreur
     * @returns renvoie false et donc impossible d'exécuter les méthodes de businness logic
     */
    generateNewError(message: string, source: string): boolean {
        if (!message || !source) return;
        const error = new ErrorResponse(message, source);
        this.errors.push(error);
        return false;
    }
}
