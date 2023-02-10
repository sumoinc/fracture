import { Project, SourceCode } from 'projen';
import { FractureComponent } from '../component';
import { Entity } from '../model';

export interface VtlOptions {
  /**
   * Directory where generated code will be placed.
   */
  gendir: string;
}

export class VtlFile extends SourceCode {
  constructor(project: Project, filePath: string) {
    super(project, filePath, { readonly: false });
    this.line('## ' + this.marker);
  }
}

export class Vtl extends FractureComponent {
  public readonly gendir: string;

  constructor(project: Project, namespace: string, options: VtlOptions) {
    super(project, namespace);

    this.gendir = options.gendir + '/vtl';

  }

  public preSynthesize() {
    const isEntity = (c: FractureComponent): c is Entity => c instanceof Entity && c.namespace === this.namespace;
    const entities = (this.project.components as FractureComponent[]).filter(isEntity);

    entities.forEach(e => {

      // request templates
      const createItemRequest = new VtlFile(this.project, `${this.gendir}/Mutation.create-${e.name}.request.vtl`);
      createItemRequest.line('{}');
      const readItemRequest = new VtlFile(this.project, `${this.gendir}/Query.read-${e.name}.request.vtl`);
      readItemRequest.line('{}');
      const updateItemRequest = new VtlFile(this.project, `${this.gendir}/Mutation.update-${e.name}.request.vtl`);
      updateItemRequest.line('{}');
      const deleteItemRequest = new VtlFile(this.project, `${this.gendir}/Mutation.delete-${e.name}.request.vtl`);
      deleteItemRequest.line('{}');

      // response templates
      const createItemResponse = new VtlFile(this.project, `${this.gendir}/Mutation.create-${e.name}.response.vtl`);
      const readItemResponse = new VtlFile(this.project, `${this.gendir}/Query.read-${e.name}.response.vtl`);
      const updateItemResponse = new VtlFile(this.project, `${this.gendir}/Mutation.update-${e.name}.response.vtl`);
      const deleteItemResponse = new VtlFile(this.project, `${this.gendir}/Mutation.delete-${e.name}.response.vtl`);

    });
  }

}

