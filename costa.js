//masowka
router.get('/ulica/all', function (req, res, next) {
    baza.find().limit(1).then(function (baza, result) {
        let arr = _.toArray(baza);
        let coordsArr = [];

        //Nie wiem czy potrzebny promise, iksDe, do poprawy
        let mainPromise = new Promise((resolve, reject) => {
            //promise dla foreacha
            let forEachPromise = new Promise((resolve, reject) => {
                //Do zwrotki dla usera
                let noOfSuccess = 0;
                let noCoords = 0;
                let arrSucc = [];
                let arrFail = [];
                let arrCheck = [];
                let arraysOfUsers = { arrSucc, arrCheck, arrFail };
                arr.forEach((user, index) => {
                    //Promise pobierajacy dane z google API
                    //console.log('user', user)
                    let coordPromise = new Promise((resolve, reject) => {
                        const street = user.addresses[0].route.concat(', ').concat(user.addresses[0].street_number);
                        console.log('ulica', street)
                        const city = user.addresses[0].locality;
                        console.log('miasto', city)

                        const address = encodeURI(street.concat(', ').concat(city)); //Dla API
                        const addressNoEncode = street.concat(', ').concat(city); //Dla zwrotki

                        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBHek4tQK4jSQhVSoxw4s4c8tz_1z3xuNI`;
                        setTimeout(function () {
                            let coords = axios.get(url).then((value) => {
                                const resp = { addressNoEncode, value, street, city }
                                return resp;
                            })
                            resolve(coords);
                        }, 100 * index);

                    })

                    //Resolve promise z API, segregacja rekordow do odpowiednich tablic
                    coordPromise.then(response => {
                        let arrPromise = new Promise((resolve, reject) => {
                            try {
                                if (response.value.data.status == 'ZERO_RESULTS') {
                                    //console.log('bledny', index, response.addressNoEncode)
                                    noCoords++;
                                    arrFail.push(response.addressNoEncode);
                                } else if (response.value.data.results[0].types == "street_address") {
                                    //console.log('adres', response.value.data.results[0].formatted_address)
                                    arrSucc.push(response.value.data.results[0].formatted_address);

                                    //Zupdejtuj w bazie
                                    const ulica = response.street.split(',');

                                    let ulicaNazwa = ulica[0].replace(/\s/g, '');
                                    let ulicaNumer = ulica[1].replace(/\s/g, '');


                                    const miasto = response.city;
                                    const lat = response.value.data.results[0].geometry.location.lat;
                                    const lon = response.value.data.results[0].geometry.location.lng;
                                    console.log(ulicaNazwa, 'naxzwa', ulicaNumer, 'numer,', miasto, 'at', lat, 'lon', lon);
                                    Bms.findOneAndUpdate({ "addresses.route": ulicaNazwa, "addresses.street_number": ulicaNumer, "addresses.locality": miasto }, { $set: { lat: lat, lon: lon, coordsSet: true } }).then(function (baza, result) {
                                        console.log('baza', baza)
                                    })

                                    noOfSuccess++;
                                } else if (response.value.data.results[0].types != "street_address") {
                                    arrFail.push(response.value.data.results[0].formatted_address);
                                    noCoords++;
                                }
                            }
                            catch (err) {
                                console.log('err', err)
                                console.log('index', index)
                            }
                            console.log('coordResp', 'succ', noOfSuccess, 'fail', noCoords, 'typ', response.value.data.results[0].types)
                            resolve(arraysOfUsers);
                        })
                        //Chce odzyskac arrays of users i przeslac go dalej
                        arrPromise.then(coords => {
                            // console.log('ostateczny', coords);
                            if (index + 1 == arr.length) {
                                resolve(coords);
                            }
                        })
                    })
                });
                console.log('ostateczny', arraysOfUsers);
            })

            //wychodze z nastepnego promise
            forEachPromise.then(coords => {
                // console.log('O KURWA WYSZŁEM', coords)
                resolve(coords);
            })
        })

        //wysylam tablice sukcesow i porazek do uzytkownika
        mainPromise.then(response => {
            res.status(200).send({
                success: true,
                'data': response
            });
        })

    })
})