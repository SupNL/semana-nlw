import { Request, Response } from 'express'
import knex from '../database/connection';

class PointsController {
    async index(req : Request, res : Response){
        const { city, uf, items } = req.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_item', 'points.id', '=', 'point_item.point_id')
            .whereIn('point_item.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        return res.json(points);
    }

    async show(req : Request, res : Response){
        const { id } = req.params;

        const point = await knex('points').where('id', id).first();

        if(!point){
            return res.status(400).json({ message: "Point not found" });
        }

        const items = await knex('items')
            .join('point_item', 'items.id', '=', 'point_item.item_id')
            .where('point_item.point_id', id)
            .select('items.title');

        return res.json({ point, items });
    }

    async create(req : Request, res : Response){
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body;
    
        const trx = await knex.transaction();
    
        const point = {
            image: 'https://images.unsplash.com/photo-1477763858572-cda7deaa9bc5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=20',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        const ids = await trx('points').insert(point);
    
        const pointItems = items.map((itemId : number) => {
            return {
                item_id: itemId,
                point_id : ids[0]
            }
        })
    
        await trx('point_item').insert(pointItems);
    
        await trx.commit();

        return res.json({
            id: ids[0],
            ... point,
        });
    }
}

export default PointsController;