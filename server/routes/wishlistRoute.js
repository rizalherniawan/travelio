const api = require('express')()
const Wishlist = require('../controller/wihslist')

api.post('/api/v1/wishlist', Wishlist.addWishlist)
api.delete('/api/v1/wishlist', Wishlist.removeItem)
api.get('/api/v1/wishlist', Wishlist.getItem)

module.exports = api
