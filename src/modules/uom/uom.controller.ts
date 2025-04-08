import { UomService } from "./services/uom.service";
import { Request, Response } from "express";

export class UomController {
  constructor(private readonly uomService: UomService = new UomService()) {}

  async createUom(req: Request, res: Response) {
    const uom = await this.uomService.createUom(req.body);
    res.status(201).json(uom);
  }
  async updateUom(req: Request, res: Response) {
    const uom = await this.uomService.updateUom(
      Number(req.params.id),
      req.body
    );
    res.status(200).json(uom);
  }
  async deleteUom(req: Request, res: Response) {
    const uom = await this.uomService.deleteUom(Number(req.params.id));
    res.status(200).json(uom);
  }
  async getAllUoms(req: Request, res: Response) {
    const uoms = await this.uomService.getAllUoms();
    res.status(200).json(uoms);
  }
}
