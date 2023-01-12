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

import { Machine } from '../model/models';
import { MachineParams } from '../model/models';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


export interface CreateMachineRequestParams {
    /** Machine creation parameters */
    machineParams?: MachineParams;
}

export interface DeleteMachineRequestParams {
    /** The identifier of the object to get */
    id: string;
}

export interface GetMachineRequestParams {
    /** The identifier of the object to get */
    id: string;
}

export interface ListMachinesRequestParams {
    /** Sort results by the specified properties and orders */
    sort?: string;
    /** Limit the number of results returned */
    limit?: number;
    /** Skip the given number of results */
    skip?: number;
    /** Filter results by id */
    id?: string;
    /** Filter results by provider */
    provider?: string;
    /** Filter results by region */
    region?: string;
    /** Filter results by instance_type */
    instanceType?: string;
    /** Filter results by root_volume_size */
    rootVolumeSize?: any;
    /** Filter results by account */
    account?: string;
    /** Filter results by status */
    status?: string;
    /** Filter results by password */
    password?: string;
    /** Filter results by last_started */
    lastStarted?: any;
    /** Filter results by public_ip */
    publicIp?: string;
    /** Filter results by max_upload */
    maxUpload?: any;
    /** Filter results by created_at */
    createdAt?: any;
    /** Filter results by os */
    os?: string;
    /** Filter results by gpu_model */
    gpuModel?: string;
    /** Filter results by vcpus */
    vcpus?: any;
    /** Filter results by ram */
    ram?: any;
    /** Filter results by instance_id */
    instanceId?: string;
}

export interface UpdateMachineRequestParams {
    /** The identifier of the object to get */
    id: string;
    /** Machine update parameters */
    machineParams?: MachineParams;
}


@Injectable({
  providedIn: 'root'
})
export class MachineService {

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
     * Create a new machine
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createMachine(requestParameters: CreateMachineRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Machine>;
    public createMachine(requestParameters: CreateMachineRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Machine>>;
    public createMachine(requestParameters: CreateMachineRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Machine>>;
    public createMachine(requestParameters: CreateMachineRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        const machineParams = requestParameters.machineParams;

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

        return this.httpClient.post<Machine>(`${this.configuration.basePath}/machines`,
            machineParams,
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
     * Delete a machine
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteMachine(requestParameters: DeleteMachineRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<any>;
    public deleteMachine(requestParameters: DeleteMachineRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<any>>;
    public deleteMachine(requestParameters: DeleteMachineRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<any>>;
    public deleteMachine(requestParameters: DeleteMachineRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        const id = requestParameters.id;
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling deleteMachine.');
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

        return this.httpClient.delete<any>(`${this.configuration.basePath}/machines/${encodeURIComponent(String(id))}`,
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
     * Get a single machine
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getMachine(requestParameters: GetMachineRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Machine>;
    public getMachine(requestParameters: GetMachineRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Machine>>;
    public getMachine(requestParameters: GetMachineRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Machine>>;
    public getMachine(requestParameters: GetMachineRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        const id = requestParameters.id;
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getMachine.');
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

        return this.httpClient.get<Machine>(`${this.configuration.basePath}/machines/${encodeURIComponent(String(id))}`,
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
     * List machines
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public listMachines(requestParameters: ListMachinesRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Array<Machine>>;
    public listMachines(requestParameters: ListMachinesRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Array<Machine>>>;
    public listMachines(requestParameters: ListMachinesRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Array<Machine>>>;
    public listMachines(requestParameters: ListMachinesRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        const sort = requestParameters.sort;
        const limit = requestParameters.limit;
        const skip = requestParameters.skip;
        const id = requestParameters.id;
        const provider = requestParameters.provider;
        const region = requestParameters.region;
        const instanceType = requestParameters.instanceType;
        const rootVolumeSize = requestParameters.rootVolumeSize;
        const account = requestParameters.account;
        const status = requestParameters.status;
        const password = requestParameters.password;
        const lastStarted = requestParameters.lastStarted;
        const publicIp = requestParameters.publicIp;
        const maxUpload = requestParameters.maxUpload;
        const createdAt = requestParameters.createdAt;
        const os = requestParameters.os;
        const gpuModel = requestParameters.gpuModel;
        const vcpus = requestParameters.vcpus;
        const ram = requestParameters.ram;
        const instanceId = requestParameters.instanceId;

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
        if (provider !== undefined && provider !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>provider, 'provider');
        }
        if (region !== undefined && region !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>region, 'region');
        }
        if (instanceType !== undefined && instanceType !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>instanceType, 'instance_type');
        }
        if (rootVolumeSize !== undefined && rootVolumeSize !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>rootVolumeSize, 'root_volume_size');
        }
        if (account !== undefined && account !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>account, 'account');
        }
        if (status !== undefined && status !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>status, 'status');
        }
        if (password !== undefined && password !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>password, 'password');
        }
        if (lastStarted !== undefined && lastStarted !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>lastStarted, 'last_started');
        }
        if (publicIp !== undefined && publicIp !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>publicIp, 'public_ip');
        }
        if (maxUpload !== undefined && maxUpload !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>maxUpload, 'max_upload');
        }
        if (createdAt !== undefined && createdAt !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>createdAt, 'created_at');
        }
        if (os !== undefined && os !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>os, 'os');
        }
        if (gpuModel !== undefined && gpuModel !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>gpuModel, 'gpu_model');
        }
        if (vcpus !== undefined && vcpus !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>vcpus, 'vcpus');
        }
        if (ram !== undefined && ram !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>ram, 'ram');
        }
        if (instanceId !== undefined && instanceId !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>instanceId, 'instance_id');
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

        return this.httpClient.get<Array<Machine>>(`${this.configuration.basePath}/machines`,
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
     * Update an existing machine
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateMachine(requestParameters: UpdateMachineRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Machine>;
    public updateMachine(requestParameters: UpdateMachineRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Machine>>;
    public updateMachine(requestParameters: UpdateMachineRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Machine>>;
    public updateMachine(requestParameters: UpdateMachineRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        const id = requestParameters.id;
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling updateMachine.');
        }
        const machineParams = requestParameters.machineParams;

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

        return this.httpClient.put<Machine>(`${this.configuration.basePath}/machines/${encodeURIComponent(String(id))}`,
            machineParams,
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