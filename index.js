const base64 = require("base-64");
const pkgConfig = require("./package.json");
const tokenEndpoint = "https://vault.omise.co/tokens";

let _publicKey;
let _apiVersion;
class ReactNativeOmise {

    config(publicKey, apiVersion = "2015-11-17") {
        _publicKey = publicKey;
        _apiVersion = apiVersion;
    }

    createToken(data) {
        return new Promise((resolve, reject) => {
            // verify a public key
            if (!_publicKey || _publicKey === "") {
                reject("Please config your public key");
                return;
            }

            // set headers
            let headers = new Headers();
            // let headers = {
            //     authorization: 'Basic ' + base64.encode(_publicKey + ":"),
            //     userAgent: pkgConfig.name + "/" + pkgConfig.version,
            //     contentType: 'application/json'
            // };
            headers.append('Authorization', 'Basic ' + base64.encode(_publicKey + ":"));
            headers.append('User-Agent', pkgConfig.name + "/" + pkgConfig.version);
            headers.append('Content-Type', 'application/json');
            if (_apiVersion && _apiVersion !== "") {
                headers.append('Omise-Version', _apiVersion);
                // headers = headers & {
                //     omiseVersion: _apiVersion
                // };
            }

            // use fetch to request Omise API
            fetch(tokenEndpoint, {
                method: 'POST',
                cache: 'no-cache',
                headers: headers,
                body: JSON.stringify(data)
            }).then((response) => {
                console.log("ok", response);
                if (response.ok && response.status === 200) {
                    resolve(response.json());
                } else {
                    reject(response.statusText);
                }
            }).catch((error) => resolve(error));
        });
    }
}


const reactNativeOmise = new ReactNativeOmise();

module.exports = {
    config: reactNativeOmise.config,
    createToken: reactNativeOmise.createToken
}