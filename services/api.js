const fetch = require('node-fetch');


class Api {

    get(url, params) {
        return request(url, Object.assign({}, { method: 'GET' }, params));
    }


    post() {

    }


    update() {

    }



    delete() {

    }


    request(url, params) {
        return fetch(url, params).then(res => res.json()).then(json => console.log(json));
    }

}

module.exports = new Api();