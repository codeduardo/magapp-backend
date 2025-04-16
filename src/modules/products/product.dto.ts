export class CreateProductDto {
  constructor(
    public barcode: string,
    public name: string,
    public brand: string,
    public price: number,
    public packaging_type: string,
    public capacity: number,
    public unit: string,
    public categories: string[],
    public quantity_per_package: number
  ) {}
}
