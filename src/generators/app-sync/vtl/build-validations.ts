import { Shape, ValidationRule } from "../../../model";
import { VtlSource } from "../../vtl/vtl-source";

export const buildValidations = (resolver: VtlSource, e: Shape) => {
  resolver.line("## Validations");
  e.attributes.forEach((a) => {
    a.createValidations.forEach((rule) => {
      switch (rule) {
        case ValidationRule.REQUIRED:
          resolver.open(`#if( !$ctx.args.input.${a.shortName} )`);
          resolver.line(
            `$util.error("Input ${a.shortName} is required.", "InvalidParameter")`
          );
          resolver.close(`#end`);
          resolver.line("\n");
          break;

        default:
          break;
      }
    });
  });
};
