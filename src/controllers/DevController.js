const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {

    async index(req, res) {
        const devs = await Dev.find();

        return res.json(devs);
    },

    async remove(req, res) {
        const { _id } = req.params;
        try {
            await Dev.deleteOne({ _id });
            return res.status(204).json();
        } catch(e) {
            return res.status(404).json();
        }
        
    },

    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body;
    
        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const response = await axios.get(`https://api.github.com/users/${github_username}`);
    
            const { name = login, avatar_url, bio } = response.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            };
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });
        }

        // Filtrar conexões max 10km dist
        const sendSocketMessageTo = findConnections(
            { latitude, longitude }, dev.techs
        )

        sendMessage(sendSocketMessageTo, 'new-dev', dev)

        console.log(sendSocketMessageTo);
    
        return res.json(dev);
    }
}