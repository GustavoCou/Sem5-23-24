export default interface IHttpRequestsService  {
  getRequest(endpoint: string): Promise<any>;
  postRequest(endpoint: string, data: any): Promise<any>;
  putRequest(endpoint: string, data: any): Promise<any>;
}
