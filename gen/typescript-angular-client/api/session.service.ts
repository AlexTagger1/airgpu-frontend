/**
 * airgpu
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

import { Session } from '../model/models';
import { SessionParams } from '../model/models';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


export interface CreateSessionRequestParams {
    /** Session creation parameters */
    sessionParams?: SessionParams;
}

export interface DeleteSessionRequestParams {
    /** The identifier of the object to get */
    id: string;
}

export interface GetSessionRequestParams {
    /** The identifier of the object to get */
    id: string;
}

export interface ListSessionsRequestParams {
    /** Sort results by the specified properties and orders */
    sort?: string;
    /** Limit the number of results returned */
    limit?: number;
    /** Skip the given number of results */
    skip?: number;
    /** Filter results by id */
    id?: string;
    /** Filter results by started_at */
    startedAt?: any;
    /** Filter results by finished_at */
    finishedAt?: any;
    /** Filter results by billed_hours */
    billedHours?: any;
    /** Filter results by is_finished */
    isFinished?: boolean;
    /** Filter results by machine */
    machine?: string;
    /** Filter results by account */
    account?: string;
    /** Filter results by provisioning_type */
    provisioningType?: string;
}

export interface UpdateSessionRequestParams {
    /** The identifier of the object to get */
    id: string;
    /** Session update parameters */
    sessionParams?: SessionParams;
}


@Injectable({
  providedIn: 'root'
})
export class SessionService {

    protected basePath = 'https://apis.stackprint.io/airgpu';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }


    private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }

    private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
        if (value == null) {
            return httpParams;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                (value as any[]).forEach( elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key,
                        (value as Date).toISOString().substr(0, 10));
                } else {
                   throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach( k => httpParams = this.addToHttpParamsRecursive(
                    httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        } else if (key != null) {
            httpParams = httpParams.append(key, value);
        } else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }

    /**
     * Create a new session
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createSession(requestParameters: CreateSessionRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Session>;
    public createSession(requestParameters: CreateSessionRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Session>>;
    public createSession(requestParameters: CreateSessionRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Session>>;
    public createSession(requestParameters: CreateSessionRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        const sessionParams = requestParameters.sessionParams;

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (apiKeyAuth) required
        credential = this.configuration.lookupCredential('apiKeyAuth');
        if (credential) {
            headers = headers.set('API-Key', credential);
        }

        // authentication (tokenAuth) required
        credential = this.configuration.lookupCredential('tokenAuth');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.post<Session>(`${this.configuration.basePath}/sessions`,
            sessionParams,
            {
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Delete a session
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteSession(requestParameters: DeleteSessionRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<any>;
    public deleteSession(requestParameters: DeleteSessionRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<any>>;
    public deleteSession(requestParameters: DeleteSessionRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<any>>;
    public deleteSession(requestParameters: DeleteSessionRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        const id = requestParameters.id;
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling deleteSession.');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (apiKeyAuth) required
        credential = this.configuration.lookupCredential('apiKeyAuth');
        if (credential) {
            headers = headers.set('API-Key', credential);
        }

        // authentication (tokenAuth) required
        credential = this.configuration.lookupCredential('tokenAuth');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.delete<any>(`${this.configuration.basePath}/sessions/${encodeURIComponent(String(id))}`,
            {
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get a single session
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getSession(requestParameters: GetSessionRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Session>;
    public getSession(requestParameters: GetSessionRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Session>>;
    public getSession(requestParameters: GetSessionRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Session>>;
    public getSession(requestParameters: GetSessionRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        const id = requestParameters.id;
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getSession.');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (apiKeyAuth) required
        credential = this.configuration.lookupCredential('apiKeyAuth');
        if (credential) {
            headers = headers.set('API-Key', credential);
        }

        // authentication (tokenAuth) required
        credential = this.configuration.lookupCredential('tokenAuth');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.get<Session>(`${this.configuration.basePath}/sessions/${encodeURIComponent(String(id))}`,
            {
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * List sessions
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public listSessions(requestParameters: ListSessionsRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Array<Session>>;
    public listSessions(requestParameters: ListSessionsRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Array<Session>>>;
    public listSessions(requestParameters: ListSessionsRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Array<Session>>>;
    public listSessions(requestParameters: ListSessionsRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        const sort = requestParameters.sort;
        const limit = requestParameters.limit;
        const skip = requestParameters.skip;
        const id = requestParameters.id;
        const startedAt = requestParameters.startedAt;
        const finishedAt = requestParameters.finishedAt;
        const billedHours = requestParameters.billedHours;
        const isFinished = requestParameters.isFinished;
        const machine = requestParameters.machine;
        const account = requestParameters.account;
        const provisioningType = requestParameters.provisioningType;

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (sort !== undefined && sort !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>sort, 'sort');
        }
        if (limit !== undefined && limit !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>limit, 'limit');
        }
        if (skip !== undefined && skip !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>skip, 'skip');
        }
        if (id !== undefined && id !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>id, 'id');
        }
        if (startedAt !== undefined && startedAt !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>startedAt, 'started_at');
        }
        if (finishedAt !== undefined && finishedAt !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>finishedAt, 'finished_at');
        }
        if (billedHours !== undefined && billedHours !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>billedHours, 'billed_hours');
        }
        if (isFinished !== undefined && isFinished !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>isFinished, 'is_finished');
        }
        if (machine !== undefined && machine !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>machine, 'machine');
        }
        if (account !== undefined && account !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>account, 'account');
        }
        if (provisioningType !== undefined && provisioningType !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>provisioningType, 'provisioning_type');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (apiKeyAuth) required
        credential = this.configuration.lookupCredential('apiKeyAuth');
        if (credential) {
            headers = headers.set('API-Key', credential);
        }

        // authentication (tokenAuth) required
        credential = this.configuration.lookupCredential('tokenAuth');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.get<Array<Session>>(`${this.configuration.basePath}/sessions`,
            {
                params: queryParameters,
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Update an existing session
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateSession(requestParameters: UpdateSessionRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Session>;
    public updateSession(requestParameters: UpdateSessionRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Session>>;
    public updateSession(requestParameters: UpdateSessionRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Session>>;
    public updateSession(requestParameters: UpdateSessionRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        const id = requestParameters.id;
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling updateSession.');
        }
        const sessionParams = requestParameters.sessionParams;

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (apiKeyAuth) required
        credential = this.configuration.lookupCredential('apiKeyAuth');
        if (credential) {
            headers = headers.set('API-Key', credential);
        }

        // authentication (tokenAuth) required
        credential = this.configuration.lookupCredential('tokenAuth');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.put<Session>(`${this.configuration.basePath}/sessions/${encodeURIComponent(String(id))}`,
            sessionParams,
            {
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}