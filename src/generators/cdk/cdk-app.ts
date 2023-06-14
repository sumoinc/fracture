import { Component } from "projen";
import { Service } from "../../core/service";

export class CdkApp extends Component {
  public readonly service: Service;

  constructor(service: Service) {
    super(service.project);

    this.service = service;
  }

  // public build() {
  //   this.writeConstruct();
  // }

  // public writeConstruct = () => {
  //   new TypeScriptSource(this, join(this.service.ts.outdir, `app.ts`));
  // };
}
