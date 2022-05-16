export interface IOperation {
  /** Категория операции **/
  categoryName: string | null;
  /** Дата операции **/
  date: string;
  /** Сумма операции **/
  value: number;
  /** Карта списания **/
  card: string;
}
