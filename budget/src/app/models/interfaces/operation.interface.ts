export interface IOperation {
  /** Категория операции **/
  categoryName: string;
  /** Дата операции **/
  date: string;
  /** Сумма операции **/
  value: number;
  /** Карта списания **/
  card: string;
  /** ID операции **/
  id: string;
}
