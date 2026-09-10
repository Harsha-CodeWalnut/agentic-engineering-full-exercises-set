export interface RoutingInput {
  pushAvailable: boolean;
  smsAvailable: boolean;
  smsConsent: boolean;
  emailAvailable: boolean;
}
export function selectNotificationRoute(input: RoutingInput): {
  channel: "push" | "sms" | "email" | "queue";
  durable: boolean;
};
