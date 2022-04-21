export class MoneyType {
  constructor(readonly name: string, readonly icon: string) {}

  toString(): string {
    return `${this.name} - ${this.icon}`
  }
}
