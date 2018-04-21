import {dispatch} from '../state/store';
import {apiError} from '../state/actions/api'

type HTTPProtocol = 'http' | 'https';
type HTTPMethod = 'GET' | 'POST';

interface HTTPRequest {
    protocol: HTTPProtocol,
    domain: string,
    method?: HTTPMethod
    path?: string,
    queryParams?: object | string
    headers?: object,
    payload?: object,
    withCredentials?: boolean
}
interface ApiRequest {
    path: string,
    method: HTTPMethod,
    queryParams?: object | string
}

const toQueryParams = (queryParams: object | string): string => {
    if (typeof queryParams === 'string') {
        return queryParams;
    };
    let params: string[] = [];
    for (let property in queryParams) {
        if (queryParams.hasOwnProperty(property)) {
            params.push(`${encodeURIComponent(property)}=${encodeURIComponent(queryParams[property].toString())}`)
        }
    }
    return params.join('&');
};

const http = (req: HTTPRequest) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = req.queryParams
        ? `${req.protocol}://${req.domain}/${req.path || ''}?${toQueryParams(req.queryParams)}`
        : `${req.protocol}://${req.domain}/${req.path || ''}`;
    xhr.open(req.method || 'GET', url);
    if (req.headers) {
        Object.keys(req.headers).forEach((header) => {
            xhr.setRequestHeader(header, req[header]);
        });
    };
    xhr.onload = () => {
        if (xhr.status < 200 || xhr.status > 299) {
            reject({status: xhr.status, statusText: xhr.statusText});
        } else {
            resolve(xhr.response);
        }
    };
    xhr.withCredentials = req.withCredentials ? true : false;
    xhr.onerror = () => reject({status: xhr.status, statusText: xhr.statusText});
    xhr.send(req.payload || {})
});

const apiGET = (params: ApiRequest) => {
    const req = Object.assign({
        protocol: 'https' as HTTPProtocol,
        domain: 'www.overhear.uk',
        method: 'GET' as HTTPMethod,
        withCredentials: true
    }, params);
    return http(req)
        .then((json: string) => {
            try {
                return JSON.parse(json);
            } catch (err) {
                console.error(`Bad status: ${err}`);
                dispatch(apiError('Error connecting to the server.'));
            }
        })
        .catch((err) => {
            dispatch(apiError('Error connecting to the server.'))
        });
};

export {HTTPProtocol, HTTPMethod, HTTPRequest, ApiRequest, http, apiGET};
