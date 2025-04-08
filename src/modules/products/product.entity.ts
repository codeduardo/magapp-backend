interface IProductEntity {
  id: number;
  barcode: string;
  name: string;
  brand: string;
  packagingType: string;
  capacity: number;
  entryDate: Date;
  depletedDate: Date;
  unitId: number;
  productCategories: number[];
  productVariants: number[];
  unitOfMeasure: number;
}

export class ProductEntity {
  id: number;
  barcode: string;
  name: string;
  brand: string;
  packagingType: string;
  capacity: number;
  entryDate: Date;
  depletedDate: Date;
  unitId: number;
  productCategories: number[];
  productVariants: number[];
  unitOfMeasure: number;

  constructor(data: IProductEntity) {
    this.id = data.id;
    this.barcode = data.barcode;
    this.name = data.name;
    this.brand = data.brand;
    this.packagingType = data.packagingType;
    this.capacity = data.capacity;
    this.entryDate = data.entryDate;
    this.depletedDate = data.depletedDate;
    this.unitId = data.unitId;
    this.productCategories = data.productCategories;
    this.productVariants = data.productVariants;
    this.unitOfMeasure = data.unitOfMeasure;
  }
}
