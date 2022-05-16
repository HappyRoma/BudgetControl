export interface ICategory {
  /** Название категории **/
  name: string;
  /** Цвет иконки категории + цвет для отображения на диаграмме **/
  color: string;
  /** Иконка категории **/
  icon: string;
  /** Тип категории **/
  type: CategoryType;
}


export type CategoryType = 'income' | 'expend';
