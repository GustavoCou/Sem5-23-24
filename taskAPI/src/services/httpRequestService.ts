import axios, { AxiosResponse } from 'axios';
import config from '../../config';
import { Inject, Service } from 'typedi';
import IHttpRequestsService from './IServices/IHttpRequestsService';

@Service()
export default class HttpRequestService implements IHttpRequestsService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = config.backendAPI; // Sua URL base atual
    //this.checkConnection(); // Verifica a conexão ao construir a classe
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}/${endpoint}`;
  }

  public async getRequest<T>(endpoint: string): Promise<T> {
    const url = this.buildUrl(endpoint);
    return axios.get(url).then((response: AxiosResponse<T>) => response.data);
  }

  public async postRequest<T>(endpoint: string, data: any): Promise<T> {
    const url = this.buildUrl(endpoint);
    return axios.post(url, data).then((response: AxiosResponse<T>) => response.data);
  }

  public async putRequest<T>(endpoint: string, data: any): Promise<T> {
    const url = this.buildUrl(endpoint);
    const response = await axios.patch(url, data);
    return response.data;
  }

  private async checkConnection(): Promise<void> {
    try {
      await axios.head(this.baseUrl);
    } catch (error) {
      throw new Error('Connection to a URL ' + this.baseUrl + ' was not successful.');
    }
  }
}
