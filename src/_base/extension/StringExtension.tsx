export {};
// Khai báo một module ambient
declare global {
  interface String {
    isNullOrEmpty(): boolean;
  }
}

String.prototype.isNullOrEmpty = function (): boolean {
  return this == null || this.trim() === "" || this.length < 1;
};

export function isNullOrEmpty(input?: string): boolean {
  return (
    input == undefined ||
    input == null ||
    input.trim() === "" ||
    input.length < 1
  );
}

export function isNullOrUndefined(input?: any): boolean {
  return input === undefined || input === null;
}

export function isNullOrUndefinedArry(input?: Array<any>): boolean {
  return input === undefined || input === null || input.length < 1;
}
