export interface IMessageBroker {
  publish(queue: string, message: object): Promise<void>
}
