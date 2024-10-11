export enum TaskType {
  SECURITY_TASK = 'securityTask',
  PICK_UP_DELIVERY_TASK = 'pickupDeliveryTask',
}

/**
 * class TaskType {
 *   static readonly PICK_UP_DELIVERY_TASK = new TaskType('pickupDeliveryTask');
 *   static readonly SECURITY_TASK = new TaskType('securityTask');
 *
 *   private constructor(private value: string) {}
 *
 *   getValue(): string {
 *     return this.value;
 *   }
 *
 *   toString(): string {
 *     return this.value;
 *   }
 * }
 */
