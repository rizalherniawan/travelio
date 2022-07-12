const { wishlist } = require('../models/index')

class Wishlist {
    static async addWishlist(req,res,next) {
        try {
            const findWihslist = await wishlist.findOne({where:{book_idn: req.body.book_idn}})
            if(findWihslist) return res.status(400).json({message: "item already in wishlist"})
            await wishlist.create({
                name: req.body.name,
                rating: req.body.rating,
                thumbnail: req.body.thumbnail,
                book_idn: req.body.book_idn
            })
            return res.status(200).json({message: "item successfully added to wishlist"})
        } catch (error) {
            next(error)
        }
    }
    static async removeItem(req,res,next) {
        try {
            await wishlist.destroy({where:{book_idn: req.body.book_idn}})
            return res.status(200).json({message: "item successfully deleted from wishlist"})
        } catch (error) {
            next(error)
        }
    }
    static async getItem(req,res,next) {
        try {
            const items = await wishlist.findAll()
            return res.status(200).json({data: items})
        } catch (error) {
            next(error)
        }
    }
    
}

module.exports = Wishlist