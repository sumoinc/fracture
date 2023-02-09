import { Project, SourceCode } from 'projen';
import { FractureComponent } from '../component';
import { Entity } from '../model';

export interface VtlOptions {
  /**
   * Directory where generated code will be placed.
   */
  gendir: string;
}

export class Vtl extends FractureComponent {
  public readonly gendir: string;

  constructor(project: Project, namespace: string, options: VtlOptions) {
    super(project, namespace);

    this.gendir = options.gendir + '/vtl';


  }


  public synthesize() {
    const isEntity = (c: FractureComponent): c is Entity => c instanceof Entity && c.namespace === this.namespace;
    const entities = (this.project.components as FractureComponent[]).filter(isEntity);

    entities.forEach(e => {

      const createItem = new SourceCode(this.project, `${this.gendir}/${e.name}/createItem.vtl`);
      createItem.line('## ' + createItem.marker);

      const readItem = new SourceCode(this.project, `${this.gendir}/${e.name}/readItem.vtl`);
      readItem.line('## ' + readItem.marker);

      const updateItem = new SourceCode(this.project, `${this.gendir}/${e.name}/updateItem.vtl`);
      updateItem.line('## ' + updateItem.marker);

      const deleteItem = new SourceCode(this.project, `${this.gendir}/${e.name}/deleteItem.vtl`);
      deleteItem.line('## ' + deleteItem.marker);
    });
  }

}

