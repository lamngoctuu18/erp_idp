export interface IMessageSend<T> {
  topic: string;
  data: T;
  type?: TypePushSocket;
}
export enum TypePushSocket {
  All = 1,
  ///không gửi đến các thiết bị của mình
  NotSelf = 2,
}
