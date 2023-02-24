import { VtlResolvers } from "./vtl-resolvers";
import { FractureComponent } from "../../core/component";
import { Fracture } from "../../core/fracture";

export class AppSync extends FractureComponent {
  constructor(fracture: Fracture) {
    super(fracture);

    // add VTL revsolvers to the app
    new VtlResolvers(fracture);
  }
}
