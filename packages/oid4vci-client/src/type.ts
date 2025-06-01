export type Status = { flow: 'pre-authorized_code' | 'authorization_code' } & {
  type: 'init';
  data: {};
};
