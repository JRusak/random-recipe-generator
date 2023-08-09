import { Ingredient } from './Ingredient';

export interface Recipe {
  id: string;
  name: string;
  category: string;
  area: string;
  instructions: string;
  ingredients: Ingredient[];
  imagePath: string;
  videoPath: string;
}
