import { join } from "path";
import { Service } from "../../core/service";
import { TypeScriptSource } from "../ts";

export class CdkApp extends TypeScriptSource {
  public readonly service: Service;

  constructor(service: Service) {
    super(service, join(service.srcDir, "ts", "app.ts"));

    // remember this service name
    this.service = service;
  }

  preSynthesize(): void {
    super.preSynthesize();
    // public build() {
    //   this.writeConstruct();
    // }
    // public writeConstruct = () => {
    //   new TypeScriptSource(this, join(this.service.ts.outdir, `app.ts`));
    // };
  }
}
